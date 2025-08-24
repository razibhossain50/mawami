import { Input, Select, SelectItem } from "@heroui/react";

interface EducationalInfoStepProps {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  updateData: (data: Partial<Record<string, unknown>>) => void;
}

export function EducationalInfoStep({ data, errors, updateData }: EducationalInfoStepProps) {
  return (
    <div className="p-6 space-y-8 bg-white rounded-xl shadow-lg border border-slate-100">
      <div className="border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-tr from-green-600 to-green-400 rounded-lg" />
          Educational Information
        </h2>
        <p className="text-slate-500 mt-1">Share your educational background</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Education Medium */}
        <Select
          label="Your Education Medium"
          placeholder="Select Medium"
          selectedKeys={data.educationMedium ? [data.educationMedium as string] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            updateData({ educationMedium: value });
          }}
          isRequired
          errorMessage={errors.educationMedium}
          isInvalid={!!errors.educationMedium}
        >
          <SelectItem key="Bangla">Bangla</SelectItem>
          <SelectItem key="English">English</SelectItem>
          <SelectItem key="Arabic">Arabic</SelectItem>
          <SelectItem key="Others">Others</SelectItem>
        </Select>

        {/* Highest Education Level */}
        <Select
          label="Highest Education Level"
          placeholder="Select Level"
          selectedKeys={data.highestEducation ? [data.highestEducation as string] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            updateData({ highestEducation: value });
          }}
          isRequired
          errorMessage={errors.highestEducation}
          isInvalid={!!errors.highestEducation}
        >
          <SelectItem key="Below SSC">Below SSC</SelectItem>
          <SelectItem key="SSC">SSC</SelectItem>
          <SelectItem key="HSC">HSC</SelectItem>
          <SelectItem key="Diploma">Diploma</SelectItem>
          <SelectItem key="Diploma Running">Diploma Running</SelectItem>
          <SelectItem key="Honours">Honours</SelectItem>
          <SelectItem key="Honours Running">Honours Running</SelectItem>
          <SelectItem key="Masters">Masters</SelectItem>
          <SelectItem key="Masters Running">Masters Running</SelectItem>
          <SelectItem key="PHD">PHD</SelectItem>
        </Select>

        {/* Institute Name */}
        <Input
          label="Institute or University Name"
          placeholder="Enter institute or university name"
          value={(data.instituteName as string) || ""}
          onChange={(e) => updateData({ instituteName: e.target.value })}
          isRequired
          errorMessage={errors.instituteName}
          isInvalid={!!errors.instituteName}
        />

        {/* Subject */}
        <Input
          label="Which subject do you study"
          placeholder="Enter your subject/major"
          value={(data.subject as string) || ""}
          onChange={(e) => updateData({ subject: e.target.value })}
        />

        {/* Passing Year */}
        <Input
          type="number"
          label="Passing Year"
          placeholder="Enter passing year"
          value={(data.passingYear as string) || ""}
          onChange={(e) => updateData({ passingYear: parseInt(e.target.value) || "" })}
          isRequired
          errorMessage={errors.passingYear}
          isInvalid={!!errors.passingYear}
        />

        {/* Result */}
        <Select
          label="Result"
          placeholder="Select Result"
          selectedKeys={data.result ? [data.result as string] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            updateData({ result: value });
          }}
          isRequired
          errorMessage={errors.result}
          isInvalid={!!errors.result}
        >
          <SelectItem key="A+">A+</SelectItem>
          <SelectItem key="A">A</SelectItem>
          <SelectItem key="A-">A-</SelectItem>
          <SelectItem key="B+">B+</SelectItem>
          <SelectItem key="B">B</SelectItem>
          <SelectItem key="B-">B-</SelectItem>
          <SelectItem key="C+">C+</SelectItem>
          <SelectItem key="C">C</SelectItem>
          <SelectItem key="D">D</SelectItem>
        </Select>
      </div>
    </div>
  );
}
