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
  
  // Address Information - Using new LocationSelector field names
  permanentLocation: z.string().min(1, "Permanent location is required"),
  permanentArea: z.string().min(1, "Permanent area is required"),
  
  presentLocation: z.string().min(1, "Present location is required"),
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
    permanentLocation: true,
    permanentArea: true,
    presentLocation: true,
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
    // Convert old address field names to new field names
    const convertedData = { ...data };
    
    // Convert permanent address fields
    if (data.permanentCountry && data.permanentDivision && data.permanentZilla && data.permanentUpazilla) {
      convertedData.permanentLocation = `${data.permanentCountry} > ${data.permanentDivision} > ${data.permanentZilla} > ${data.permanentUpazilla}`;
    }
    
    // Convert present address fields
    if (data.presentCountry && data.presentDivision && data.presentZilla && data.presentUpazilla) {
      convertedData.presentLocation = `${data.presentCountry} > ${data.presentDivision} > ${data.presentZilla} > ${data.presentUpazilla}`;
    }
    
    setFormData((prev: any) => ({
      ...prev,
      ...convertedData,
      // Ensure default values are preserved if not in loaded data
      partnerAgeMin: convertedData.partnerAgeMin || 25,
      partnerAgeMax: convertedData.partnerAgeMax || 35,
      sameAsPermanent: convertedData.sameAsPermanent || false,
    }));
    // Clear any existing errors when loading data
    setErrors({});
  }, []);

  const validateCurrentStep = () => {
    const stepSchema = stepSchemas[currentStep - 1];
    if (!stepSchema) return true;

    try {
      // For step 1, handle conditional validation for present address
      if (currentStep === 1) {
        const validationData = { ...formData };
        
        // Additional validation: ensure required fields are present
        const requiredFields = [
          'religion', 'biodataType', 'maritalStatus', 'dateOfBirth', 'age',
          'height', 'weight', 'complexion', 'profession', 'bloodGroup',
          'permanentLocation', 'permanentArea', 'healthIssues'
        ];
        
        // Check if all required fields are present
        for (const field of requiredFields) {
          if (!validationData[field]) {
            setErrors({ [field]: `${field} is required` });
            return false;
          }
        }
        
        // Check present address requirements
        if (!formData.sameAsPermanent) {
          const presentAddressErrors: any = {};
          let hasPresentAddressError = false;
          
          // Check present location
          if (!validationData.presentLocation || validationData.presentLocation.trim() === '') {
            presentAddressErrors.presentLocation = 'Present location is required';
            hasPresentAddressError = true;
          }
          
          // Check present area
          if (!validationData.presentArea || validationData.presentArea.trim() === '') {
            presentAddressErrors.presentArea = 'Present area is required';
            hasPresentAddressError = true;
          }
          
          if (hasPresentAddressError) {
            setErrors(presentAddressErrors);
            return false;
          }
        } else {
          // If sameAsPermanent is true, copy permanent data to present data for validation
          if (validationData.permanentLocation && validationData.permanentArea && 
              validationData.permanentLocation.trim() !== '' && validationData.permanentArea.trim() !== '') {
            validationData.presentLocation = validationData.permanentLocation;
            validationData.presentArea = validationData.permanentArea;
          } else {
            // If sameAsPermanent is true but permanent data is missing, that's an error
            setErrors({ 
              permanentLocation: 'Permanent location is required when present address is same as permanent',
              permanentArea: 'Permanent area is required when present address is same as permanent'
            });
            return false;
          }
        }
        
        // Now run Zod validation with the prepared data
        stepSchema.parse(validationData);
      } else {
        stepSchema.parse(formData);
      }
      
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
