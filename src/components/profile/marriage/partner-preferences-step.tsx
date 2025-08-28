'use client';
import { Input, Textarea, Card, CardBody, CardHeader, Slider } from "@heroui/react";
import { useState } from "react";

interface PartnerPreferencesStepProps {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  updateData: (data: Partial<Record<string, unknown>>) => void;
}

export function PartnerPreferencesStep({
  data,
  errors,
  updateData,
}: PartnerPreferencesStepProps) {
  const [ageRange, setAgeRange] = useState<number[]>([
    (data.partnerAgeMin as number) || 18,
    (data.partnerAgeMax as number) || 40,
  ]);

  const handleAgeRangeChange = (values: number[]) => {
    setAgeRange(values);
    updateData({
      partnerAgeMin: values[0],
      partnerAgeMax: values[1],
    });
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-lg" />
          Desired Life Partner
        </h2>
        <p className="text-slate-500 mt-1">
          Describe your preferences for an ideal life partner
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b pb-4 border-gray-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Partner Preferences
          </h3>
        </CardHeader>
        <CardBody className="space-y-8 pt-6">
          {/* Partner Age Range */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <Slider
                className="max-w-full"
                aria-label="Preferred Age Range"
                label="Preferred Age Range"
                minValue={18}
                maxValue={70}
                step={1}
                value={ageRange as [number, number]}
                onChange={(val) => {
                  const values = Array.isArray(val) ? val : [ageRange[0], ageRange[1]];
                  // Enforce min < max
                  const min = Math.min(values[0], values[1] - 1);
                  const max = Math.max(values[1], min + 1);
                  handleAgeRangeChange([min, max]);
                }}
                formatOptions={{ style: "unit", unit: "year" }}
                getValue={(vals) => Array.isArray(vals) ? `${vals[0]} - ${vals[1]} years` : `${vals} years`}
              />
            </div>

            {(errors.partnerAgeMin || errors.partnerAgeMax) && (
              <p className="text-xs text-red-500 mt-1">
                {errors.partnerAgeMin || errors.partnerAgeMax}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input
              label="Preferred Complexion"
              placeholder="Any preference"
              value={(data.partnerComplexion as string) || ""}
              onChange={(e) => updateData({ partnerComplexion: e.target.value })}
            />

            <Input
              label="Preferred Height"
              placeholder="Any preference"
              value={(data.partnerHeight as string) || ""}
              onChange={(e) => updateData({ partnerHeight: e.target.value })}
            />

            <Input
              label="Preferred Education"
              placeholder="Any preference"
              value={(data.partnerEducation as string) || ""}
              onChange={(e) => updateData({ partnerEducation: e.target.value })}
            />

            <Input
              label="Preferred Profession"
              placeholder="Any preference"
              value={(data.partnerProfession as string) || ""}
              onChange={(e) => updateData({ partnerProfession: e.target.value })}
            />
          </div>

          <Textarea
            label="Preferred Place"
            placeholder="Any location preference"
            value={(data.partnerLocation as string) || ""}
            onChange={(e) => updateData({ partnerLocation: e.target.value })}
            minRows={2}
          />

          <Textarea
            label="Details about the prospective spouse"
            placeholder="Share your expectations and preferences for your life partner"
            value={(data.partnerDetails as string) || ""}
            onChange={(e) => updateData({ partnerDetails: e.target.value })}
            minRows={3}
          />
        </CardBody>
      </Card>
    </div>
  );
}
