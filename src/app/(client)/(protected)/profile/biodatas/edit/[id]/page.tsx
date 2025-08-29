'use client';
import { useStepForm } from "@/hooks/use-step-form";
import { StepIndicator } from "@/components/profile/marriage/step-indicator";
import { PersonalInfoStep } from "@/components/profile/marriage/personal-info-step";
import { EducationalInfoStep } from "@/components/profile/marriage/educational-info-step";
import { FamilyInfoStep } from "@/components/profile/marriage/family-info-step";
import { ContactInfoStep } from "@/components/profile/marriage/contact-info-step";
import { PartnerPreferencesStep } from "@/components/profile/marriage/partner-preferences-step";
import { Button, Card, CardBody, addToast } from "@heroui/react";
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';

const steps = [
    { title: "Personal Information", subtitle: "Basic details about you" },
    { title: "Educational Information", subtitle: "Your academic background" },
    { title: "Family Information", subtitle: "About your family" },
    { title: "Desired Life Partner", subtitle: "Partner preferences" },
    { title: "Contact Information", subtitle: "Final details" },
];

export default function BiodataForm() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const params = useParams();
    const biodataId = params.id as string;
    const biodataIdRef = useRef<number | null>(null);

    // Check if this is create mode (id = "new") or edit mode (id = actual ID)
    const isCreateMode = biodataId === "new";

    const {
        currentStep,
        formData,
        errors,
        nextStep,
        prevStep,
        updateFormData,
        validateCurrentStep,
        isLastStep,
        isFirstStep,
        loadFormData,
    } = useStepForm(5);

    // Query to fetch existing biodata for editing
    const { data: existingBiodata, isLoading, error } = useQuery({
        queryKey: ['biodata', biodataId],
        queryFn: async () => {
            const token = localStorage.getItem('regular_user_access_token');
            if (!token) {
                throw new Error('Authentication required');
            }

            if (isCreateMode) {
                // For create mode, try to fetch current user's biodata to see if they already have one
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/current`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // If user already has biodata, redirect to edit mode
                        if (data && data.id) {
                            router.replace(`/profile/biodatas/edit/${data.id}`);
                            return { redirecting: true };
                        }
                    }
                    return null; // No existing biodata, proceed with create
                } catch (error) {
                    return null; // Error fetching, proceed with create
                }
            } else {
                // Edit mode - fetch specific biodata by ID (owner endpoint)
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/owner/${biodataId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch biodata');
                    }

                    const data = await response.json();
                    return data;
                } catch (error) {
                    throw new Error('Failed to load biodata for editing');
                }
            }
        },
        enabled: !!biodataId,
    });

    // Function to convert new field names back to old field names for backend compatibility
    const convertToBackendFormat = (data: Record<string, unknown>) => {
        const convertedData = { ...data };
        
        // Convert permanentLocation back to individual fields
        if (data.permanentLocation && typeof data.permanentLocation === 'string') {
            const parts = (data.permanentLocation as string).split(' > ');
            if (parts.length >= 4) {
                convertedData.permanentCountry = parts[0];
                convertedData.permanentDivision = parts[1];
                convertedData.permanentZilla = parts[2];
                convertedData.permanentUpazilla = parts[3];
            }
        }
        
        // Convert presentLocation back to individual fields
        if (data.presentLocation && typeof data.presentLocation === 'string') {
            const parts = (data.presentLocation as string).split(' > ');
            if (parts.length >= 4) {
                convertedData.presentCountry = parts[0];
                convertedData.presentDivision = parts[1];
                convertedData.presentZilla = parts[2];
                convertedData.presentUpazilla = parts[3];
            }
        }
        
        // Remove new field names to avoid confusion
        delete convertedData.permanentLocation;
        delete convertedData.presentLocation;
        
        return convertedData;
    };

    // Mutation for saving step data
    const saveStepMutation = useMutation({
        mutationFn: async ({ stepData, step }: { stepData: Record<string, unknown>; step: number }) => {
            // Convert new field names to backend format
            const convertedStepData = convertToBackendFormat(stepData);
            
            // For both create and edit mode, we use PUT /current to update user's biodata
            // This endpoint will create if doesn't exist, or update if exists
            const payload = {
                ...convertedStepData,
                step,
                completedSteps: step === 1 ? [step] : [...(existingBiodata?.completedSteps || []), step].filter((s, i, arr) => arr.indexOf(s) === i), // Add current step to completed steps
            };

            const response = await apiRequest("PUT", "/api/biodatas/current", payload);
            const result = await response.json();

            // Update biodataIdRef if we got an ID back
            if (result.id && !biodataIdRef.current) {
                biodataIdRef.current = result.id;
            }

            return result;
        },
        onSuccess: (data) => {
            // Invalidate and refetch biodata to update completed steps
            queryClient.invalidateQueries({ queryKey: ['biodata', biodataId] });

            // Move to next step on successful save (no toast for step saves)
            nextStep();
        },
        onError: (error: unknown) => {
            const stepError = handleApiError(error, 'BiodataEdit');
            logger.error('saveStepMutation error', stepError, 'BiodataEdit');
            // No toast for step save errors - user will see validation errors in the form
        },
    });

    // Final submission mutation
    const submitMutation = useMutation({
        mutationFn: async (data: Record<string, unknown>) => {
            // Convert new field names to backend format
            const convertedData = convertToBackendFormat(data);
            
            // For both create and edit mode, use PUT /current for final submission
            // This ensures the biodata is associated with the current logged-in user
            const payload = {
                ...convertedData,
                biodataApprovalStatus: 'pending',
                biodataVisibilityStatus: 'active',
                completedSteps: [1, 2, 3, 4, 5], // Mark all steps as completed
            };

            const response = await apiRequest("PUT", "/api/biodatas/current", payload);
            const result = await response.json();
            return result;
        },
        onSuccess: (data) => {
            // Show HeroUI success toast
            addToast({
                title: "Success!",
                color: "success",

                description: isCreateMode
                    ? "Your biodata has been created and submitted successfully!"
                    : "Your biodata has been updated and submitted successfully!",
                timeout: 4000,
            });

            // Redirect to the biodata view page after successful create/update
            setTimeout(() => {
                const targetId = isCreateMode ? (data.id || biodataIdRef.current) : biodataId;
                router.push(`/profile/biodatas/${targetId}`);
            }, 2000);
        },
        onError: (error: unknown) => {
            const submitError = handleApiError(error, 'BiodataEdit');
            logger.error('submitMutation.onError called with', submitError, 'BiodataEdit');
            const errorMessage = (error as Error)?.message ||
                (isCreateMode ? "Failed to create biodata. Please try again." : "Failed to update biodata. Please try again.");
            addToast({
                title: "Error",
                description: errorMessage,
            });
        },
    });

    // Load existing data when component mounts
    useEffect(() => {
        if (existingBiodata && !existingBiodata.redirecting) {
            biodataIdRef.current = existingBiodata.id;
            loadFormData(existingBiodata);
        }
    }, [existingBiodata, loadFormData]);

    // Show loading state if we're redirecting
    if (existingBiodata?.redirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to your biodata...</p>
                </div>
            </div>
        );
    }

    const handleNext = async () => {
        // Prevent multiple clicks
        if (saveStepMutation.isPending) {
            return;
        }
        
        const isValid = validateCurrentStep();
        
        if (!isValid) {
            return;
        }

        try {
            // Save current step data - nextStep() will be called in onSuccess callback
            saveStepMutation.mutate({
                stepData: formData,
                step: currentStep,
            });
            
            // Fallback: if mutation doesn't complete within 5 seconds, proceed anyway
            setTimeout(() => {
                if (saveStepMutation.isPending) {
                    nextStep();
                }
            }, 5000);
        } catch (error) {
            // If there's an error, still proceed to next step
            nextStep();
        }
    };

    const handleSubmit = async () => {
        const isValid = validateCurrentStep();
        if (!isValid) {
            return;
        }

        try {
            await submitMutation.mutateAsync(formData);
        } catch (error) {
            const submissionError = handleApiError(error, 'BiodataEdit');
            logger.error('Submission error', submissionError, 'BiodataEdit');
            // Error is handled by the mutation's onError
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        data={formData}
                        errors={errors}
                        updateData={updateFormData}
                    />
                );
            case 2:
                return (
                    <EducationalInfoStep
                        data={formData}
                        errors={errors}
                        updateData={updateFormData}
                    />
                );
            case 3:
                return (
                    <FamilyInfoStep
                        data={formData}
                        errors={errors}
                        updateData={updateFormData}
                    />
                );
            case 4:
                return (
                    <PartnerPreferencesStep
                        data={formData}
                        errors={errors}
                        updateData={updateFormData}
                    />
                );
            case 5:
                return (
                    <ContactInfoStep
                        data={formData}
                        errors={errors}
                        updateData={updateFormData}
                    />
                );
            default:
                return null;
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <Card className="max-w-md mx-auto">
                    <CardBody className="p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Biodata</h2>
                        <p className="text-gray-600 mb-6">
                            {(error as Error)?.message || "Failed to load biodata for editing"}
                        </p>
                        <div className="space-y-3">
                            <Button onClick={() => window.location.reload()} className="w-full">
                                Try Again
                            </Button>
                            <Button variant="bordered" as={Link} href="/profile/biodatas" className="w-full">
                                View Biodatas
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-5xl mx-auto px-3 md:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="text-center mb-6">
                    <Button
                        variant="bordered"
                        as={Link}
                        href={isCreateMode ? "/profile/biodatas" : `/profile/biodatas/${biodataId}`}
                        startContent={<ArrowLeft className="w-4 h-4" />}
                    >
                        {isCreateMode ? "View Biodatas" : "View Bioadata"}
                    </Button>
                </div>

                {/* Modern Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isCreateMode ? "Create Your Biodata" : "Edit Your Biodata"}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {isCreateMode
                            ? "Fill out your information step by step to create a complete and beautiful profile"
                            : "Update your information to keep your profile current and attractive"
                        }
                    </p>
                </div>

                {/* Step Indicator */}
                <StepIndicator
                    steps={steps}
                    currentStep={currentStep}
                    completedSteps={existingBiodata?.completedSteps || []}
                    className="mb-8"
                />

                {/* Form Content */}
                <Card className="shadow-sm">
                    <CardBody className="p-4 md:p-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-slate-600">Loading your biodata...</p>
                                </div>
                            </div>
                        ) : (
                            renderCurrentStep()
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-8">
                            <Button
                                className="px-3"
                                variant="bordered"
                                onClick={prevStep}
                                isDisabled={isFirstStep}
                                startContent={<ChevronLeft className="w-4 h-4" />}
                            >
                                Previous
                            </Button>

                            <div className="text-sm text-slate-500">
                                Step {currentStep} of {steps.length}
                            </div>

                            {isLastStep ? (
                                <Button
                                    className="px-3"
                                    color="primary"
                                    onClick={handleSubmit}
                                    isDisabled={submitMutation.isPending || saveStepMutation.isPending}
                                >
                                    {submitMutation.isPending
                                        ? (isCreateMode ? "Creating..." : "Updating...")
                                        : (isCreateMode ? "Create Biodata" : "Update Biodata")}
                                </Button>
                            ) : (
                                <Button
                                    color="primary"
                                    onClick={handleNext}
                                    isDisabled={saveStepMutation.isPending}
                                    endContent={<ChevronRight className="w-4 h-4" />}
                                >
                                    {saveStepMutation.isPending ? "Saving..." : "Next"}
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}