'use client';
import { useState, useCallback } from "react";
import { z } from "zod";

const biodataSchema = z.object({
  // Personal Information
  religion: z.string().min(1, "Religion is required"),
  biodataType: z.string().min(1, "Biodata type is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.number().min(18, "Age must be at least 18").max(70, "Age must be at most 70"),
  height: z.string().min(1, "Height is required"),
  weight: z.number().min(1, "Weight is required"),
  complexion: z.string().min(1, "Complexion is required"),
  profession: z.string().min(1, "Profession is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  
  // Address Information - Individual components are required, combined strings are optional
  permanentAddress: z.string().optional(),
  permanentCountry: z.string().min(1, "Permanent country is required"),
  permanentDivision: z.string().min(1, "Permanent division is required"),
  permanentZilla: z.string().min(1, "Permanent zilla is required"),
  permanentUpazilla: z.string().min(1, "Permanent upazilla is required"),
  permanentArea: z.string().min(1, "Permanent area is required"),
  
  presentAddress: z.string().optional(),
  presentCountry: z.string().min(1, "Present country is required"),
  presentDivision: z.string().min(1, "Present division is required"),
  presentZilla: z.string().min(1, "Present zilla is required"),
  presentUpazilla: z.string().min(1, "Present upazilla is required"),
  presentArea: z.string().min(1, "Present area is required"),
  sameAsPermanent: z.boolean().default(false),
  
  healthIssues: z.string().min(1, "Health issues field is required"),
  
  // Educational Information
  educationMedium: z.string().min(1, "Education medium is required"),
  highestEducation: z.string().min(1, "Highest education is required"),
  instituteName: z.string().min(1, "Institute name is required"),
  subject: z.string().optional(),
  passingYear: z.number().min(1950, "Invalid passing year").max(2030, "Invalid passing year"),
  result: z.string().min(1, "Result is required"),
  
  // Family Information
  economicCondition: z.string().min(1, "Economic condition is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  fatherProfession: z.string().min(1, "Father's profession is required"),
  fatherAlive: z.string().min(1, "Father's status is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  motherProfession: z.string().min(1, "Mother's profession is required"),
  motherAlive: z.string().min(1, "Mother's status is required"),
  brothersCount: z.number().min(0, "Invalid number").max(10, "Invalid number"),
  sistersCount: z.number().min(0, "Invalid number").max(10, "Invalid number"),
  familyDetails: z.string().optional(),
  
  // Partner Preferences
  partnerAgeMin: z.number().min(18, "Minimum age should be 18").max(70, "Maximum age should be 70"),
  partnerAgeMax: z.number().min(18, "Minimum age should be 18").max(70, "Maximum age should be 70"),
  partnerComplexion: z.string().optional(),
  partnerHeight: z.string().optional(),
  partnerEducation: z.string().optional(),
  partnerProfession: z.string().optional(),
  partnerLocation: z.string().optional(),
  partnerDetails: z.string().optional(),
  
  // Contact Information
  fullName: z.string().min(1, "Full name is required"),
  profilePicture: z.string().optional(),
  email: z.string().email("Invalid email address"),
  guardianMobile: z.string().min(1, "Guardian's mobile is required"),
  ownMobile: z.string().min(1, "Own mobile is required"),
});

const stepSchemas = [
  // Step 1: Personal Information
  biodataSchema.pick({
    religion: true,
    biodataType: true,
    maritalStatus: true,
    dateOfBirth: true,
    age: true,
    height: true,
    weight: true,
    complexion: true,
    profession: true,
    bloodGroup: true,
    permanentCountry: true,
    permanentDivision: true,
    permanentZilla: true,
    permanentUpazilla: true,
    permanentArea: true,
    presentCountry: true,
    presentDivision: true,
    presentZilla: true,
    presentUpazilla: true,
    presentArea: true,
    healthIssues: true,
  }),
  
  // Step 2: Educational Information
  biodataSchema.pick({
    educationMedium: true,
    highestEducation: true,
    instituteName: true,
    passingYear: true,
    result: true,
  }),
  
  // Step 3: Family Information
  biodataSchema.pick({
    economicCondition: true,
    fatherName: true,
    fatherProfession: true,
    fatherAlive: true,
    motherName: true,
    motherProfession: true,
    motherAlive: true,
    brothersCount: true,
    sistersCount: true,
  }),
  
  // Step 4: Partner Preferences
  biodataSchema.pick({
    partnerAgeMin: true,
    partnerAgeMax: true,
  }),
  
  // Step 5: Contact Information
  biodataSchema.pick({
    fullName: true,
    email: true,
    guardianMobile: true,
    ownMobile: true,
  }),
];

export function useStepForm(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    partnerAgeMin: 25,
    partnerAgeMax: 35,
    sameAsPermanent: false,
  });
  const [errors, setErrors] = useState<any>({});

  const updateFormData = (data: Partial<any>) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(data).forEach(key => {
      delete newErrors[key];
    });
    setErrors(newErrors);
  };

  const loadFormData = useCallback((data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      ...data,
      // Ensure default values are preserved if not in loaded data
      partnerAgeMin: data.partnerAgeMin || 25,
      partnerAgeMax: data.partnerAgeMax || 35,
      sameAsPermanent: data.sameAsPermanent || false,
    }));
    // Clear any existing errors when loading data
    setErrors({});
  }, []);

  const validateCurrentStep = () => {
    const stepSchema = stepSchemas[currentStep - 1];
    if (!stepSchema) return true;

    try {
      stepSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return {
    currentStep,
    formData,
    errors,
    updateFormData,
    loadFormData,
    validateCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
  };
}
