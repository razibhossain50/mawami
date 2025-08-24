'use client';
import { Input, Textarea, Card, CardBody, CardHeader } from "@heroui/react";
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
    (data.partnerAgeMin as number) || 25,
    (data.partnerAgeMax as number) || 35,
  ]);

  const handleAgeRangeChange = (values: number[]) => {
    setAgeRange(values);
    updateData({
      partnerAgeMin: values[0],
      partnerAgeMax: values[1],
    });
  };

  return (
    <div className="p-6 space-y-8 bg-white rounded-xl shadow-lg border border-slate-100">
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
            <div className="text-sm font-medium text-slate-700">
              Preferred Age Range <span className="text-red-500">*</span>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="relative px-4">
                <div className="relative h-12 flex items-center justify-between">
                  {/* Track background */}
                  <div className="absolute w-full h-1 bg-slate-200 rounded-full top-1/2 -translate-y-1/2"></div>

                  {/* Active range */}
                  <div
                    className="absolute h-1 bg-gradient-to-r from-rose-500 to-rose-400 rounded-full top-1/2 -translate-y-1/2"
                    style={{
                      left: `${((ageRange[0] - 18) / (70 - 18)) * 100}%`,
                      width: `${((ageRange[1] - ageRange[0]) / (70 - 18)) * 100}%`,
                    }}
                  />

                  {/* Left (Min) Tooltip */}
                  <div
                    className="absolute -top-9 transform -translate-x-1/2"
                    style={{
                      left: `${((ageRange[0] - 18) / (70 - 18)) * 100}%`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shadow">
                      {ageRange[0]}
                    </div>
                  </div>

                  {/* Right (Max) Tooltip */}
                  <div
                    className="absolute -top-9 transform -translate-x-1/2"
                    style={{
                      left: `${((ageRange[1] - 18) / (70 - 18)) * 100}%`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shadow">
                      {ageRange[1]}
                    </div>
                  </div>

                  {/* Sliders */}
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={ageRange[0]}
                    onChange={(e) => {
                      const newMin = Math.min(
                        parseInt(e.target.value),
                        ageRange[1] - 1,
                      );
                      handleAgeRangeChange([newMin, ageRange[1]]);
                    }}
                    className="absolute w-full h-8 bg-transparent appearance-none cursor-pointer z-10"
                  />
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={ageRange[1]}
                    onChange={(e) => {
                      const newMax = Math.max(
                        parseInt(e.target.value),
                        ageRange[0] + 1,
                      );
                      handleAgeRangeChange([ageRange[0], newMax]);
                    }}
                    className="absolute w-full h-8 bg-transparent appearance-none cursor-pointer z-10"
                  />
                </div>
              </div>
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
