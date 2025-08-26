import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  title: string;
  subtitle: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

export function StepIndicator({ steps, currentStep, completedSteps = [], className }: StepIndicatorProps) {
  const currentStepInfo = steps[currentStep - 1];

  return (
    <div className={cn("w-full", className)}>

      {/* Current Step Information - Centered and Dynamic */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-1">
          {currentStepInfo?.title}
        </h3>
        <p className="text-sm text-gray-600">
          {currentStepInfo?.subtitle}
        </p>
      </div>

      {/* Horizontal Step Progress */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "flex w-7 md:w-10 h-7 md:h-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
                  isActive && "bg-blue-600 text-white",
                  isCompleted && "bg-green-600 text-white",
                  !isActive && !isCompleted && "bg-white text-gray-400 border-2 border-gray-300"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-4 md:w-16 lg:w-20 mx-2 transition-colors duration-200",
                    isCompleted ? "bg-green-600" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>


    </div>
  );
}
