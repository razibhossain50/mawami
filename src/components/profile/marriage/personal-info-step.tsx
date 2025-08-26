'use client';
import { Input, Select, SelectItem, Textarea, Checkbox, Card, CardBody, CardHeader } from "@heroui/react";
import { LocationSelector } from "@/components/form/LocationSelector";
import { useState, useEffect } from "react";

interface PersonalInfoStepProps {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  updateData: (data: Partial<Record<string, unknown>>) => void;
}

export function PersonalInfoStep({ data, errors, updateData }: PersonalInfoStepProps) {
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Height options array
  const heightOptions = [
    { key: 'below-4', label: 'Below 4 feet' },
    { key: '4.0', label: '4\'0"' },
    { key: '4.1', label: '4\'1"' },
    { key: '4.2', label: '4\'2"' },
    { key: '4.3', label: '4\'3"' },
    { key: '4.4', label: '4\'4"' },
    { key: '4.5', label: '4\'5"' },
    { key: '4.6', label: '4\'6"' },
    { key: '4.7', label: '4\'7"' },
    { key: '4.8', label: '4\'8"' },
    { key: '4.9', label: '4\'9"' },
    { key: '4.10', label: '4\'10"' },
    { key: '4.11', label: '4\'11"' },
    { key: '5.0', label: '5\'0"' },
    { key: '5.1', label: '5\'1"' },
    { key: '5.2', label: '5\'2"' },
    { key: '5.3', label: '5\'3"' },
    { key: '5.4', label: '5\'4"' },
    { key: '5.5', label: '5\'5"' },
    { key: '5.6', label: '5\'6"' },
    { key: '5.7', label: '5\'7"' },
    { key: '5.8', label: '5\'8"' },
    { key: '5.9', label: '5\'9"' },
    { key: '5.10', label: '5\'10"' },
    { key: '5.11', label: '5\'11"' },
    { key: '6.0', label: '6\'0"' },
    { key: '6.1', label: '6\'1"' },
    { key: '6.2', label: '6\'2"' },
    { key: '6.3', label: '6\'3"' },
    { key: '6.4', label: '6\'4"' },
    { key: '6.5', label: '6\'5"' },
    { key: '6.6', label: '6\'6"' },
    { key: '6.7', label: '6\'7"' },
    { key: '6.8', label: '6\'8"' },
    { key: '6.9', label: '6\'9"' },
    { key: '6.10', label: '6\'10"' },
    { key: '6.11', label: '6\'11"' },
    { key: '7.0', label: '7\'0"' },
    { key: 'upper-7', label: 'Upper 7 feet' }
  ];

  const handleSelectionChange = (selection: unknown, field: string) => {
    let value: string | undefined;

    if (typeof selection === 'string') {
      value = selection;
    } else if (selection instanceof Set) {
      value = selection.values().next().value;
    } else if (selection && typeof selection === 'object' && 'currentKey' in selection) {
      value = (selection as { currentKey: string }).currentKey;
    } else if (Array.isArray(selection)) {
      value = selection[0];
    }

    updateData({ [field]: value });
  };

  useEffect(() => {
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth as string);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      setCalculatedAge(age);
      // Update age in form data only if it's different
      if (data.age !== age) {
        updateData({ age });
      }
    }
  }, [data.dateOfBirth]);

  const handleSameAddressChange = (checked: boolean) => {
    updateData({ sameAsPermanent: checked });

    if (checked) {
      updateData({
        presentCountry: data.permanentCountry,
        presentDivision: data.permanentDivision,
        presentZilla: data.permanentZilla,
        presentUpazilla: data.permanentUpazilla,
        presentArea: data.permanentArea,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="border-b pb-4 border-gray-200">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg" />
            Personal Information
          </h2>
          <p className="text-slate-500 mt-1">Please provide your personal details accurately</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Religion */}
          <Select
            label="Religion"
            placeholder="Select Religion"
            selectedKeys={data.religion ? [data.religion as string] : []}
            onSelectionChange={(keys) => handleSelectionChange(keys, 'religion')}
            isRequired
            errorMessage={errors.religion}
            isInvalid={!!errors.religion}
          >
            {['Islam', 'Christianity', 'Hinduism', 'Buddhism', 'Other'].map((item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ))}
          </Select>

          {/* Biodata Type */}
          <Select
            label="Biodata Type"
            placeholder="Select Type"
            selectedKeys={data.biodataType ? [data.biodataType as string] : []}
            onSelectionChange={(keys) => handleSelectionChange(keys, 'biodataType')}
            isRequired
            errorMessage={errors.biodataType}
            isInvalid={!!errors.biodataType}
          >
            {['Male', 'Female'].map((item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
          {/* Marital Status */}
          <Select
            label="Marital Status"
            placeholder="Select Status"
            selectedKeys={data.maritalStatus ? [data.maritalStatus as string] : []}
            onSelectionChange={(keys) => handleSelectionChange(keys, 'maritalStatus')}
            isRequired
            errorMessage={errors.maritalStatus}
            isInvalid={!!errors.maritalStatus}
          >
            {['Married', 'Unmarried', 'Divorced', 'Widow', 'Widower'].map((item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ))}
          </Select>

          {/* Date of Birth */}
          <div className="space-y-2.5">
            <Input
              type="date"
              label="Date of Birth"
              value={(data.dateOfBirth as string) || ""}
              onChange={(e) => updateData({ dateOfBirth: e.target.value })}
              isRequired
              errorMessage={errors.dateOfBirth}
              isInvalid={!!errors.dateOfBirth}
              description={calculatedAge !== null ? `Age: ${calculatedAge} years` : undefined}
            />
          </div>
          {/* Height */}
          <Select
            label="Height"
            placeholder="Select Height"
            selectedKeys={data.height ? [data.height as string] : []}
            onSelectionChange={(keys) => handleSelectionChange(keys, 'height')}
            isRequired
            errorMessage={errors.height}
            isInvalid={!!errors.height}
          >
            {heightOptions.map((item) => (
              <SelectItem key={item.key} textValue={item.label}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
          {/* Weight */}
          <Input
            type="number"
            label="Weight"
            placeholder="Enter weight"
            value={data.weight ? String(data.weight) : ""}
            onChange={(e) => {
              const value = e.target.value;
              updateData({ weight: value ? parseInt(value) || undefined : undefined });
            }}
            endContent={<span className="text-slate-500 text-sm">kg</span>}
            isRequired
            errorMessage={errors.weight}
            isInvalid={!!errors.weight}
          />

          {/* Complexion */}
          <Select
            label="Complexion"
            placeholder="Select Complexion"
            selectedKeys={data.complexion ? [data.complexion as string] : []}
            onSelectionChange={(keys) => handleSelectionChange(keys, 'complexion')}
            isRequired
            errorMessage={errors.complexion}
            isInvalid={!!errors.complexion}
          >
            {['Black', 'Dusky', 'Wheatish', 'Fair', 'Very Fair'].map((item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ))}
          </Select>

          {/* Profession */}
          <Input
            label="Profession"
            placeholder="Enter your profession"
            value={(data.profession as string) || ""}
            onChange={(e) => updateData({ profession: e.target.value })}
            isRequired
            errorMessage={errors.profession}
            isInvalid={!!errors.profession}
          />

          {/* Blood Group */}
          <Select
            label="Blood Group"
            placeholder="Select Blood Group"
            selectedKeys={data.bloodGroup ? [data.bloodGroup as string] : []}
            onSelectionChange={(keys) => handleSelectionChange(keys, 'bloodGroup')}
            isRequired
            errorMessage={errors.bloodGroup}
            isInvalid={!!errors.bloodGroup}
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((item) => (
              <SelectItem key={item} textValue={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Address Section */}
      <Card className="mt-8 shadow-md">
        <CardHeader className="border-b pb-4 border-gray-200">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg" />
            Address Information
          </h3>
        </CardHeader>
        <CardBody className="space-y-8">
          {/* Permanent Address */}
          <div>
            <div className="rounded-lg bg-slate-50 p-4 shadow-inner">
              <LocationSelector
                dataSource="addressData"
                type="permanent"
                data={data}
                errors={errors}
                updateData={updateData}
                onLocationSelect={() => {}} // Not used in addressData mode
              />
              <div className="mt-4">
                <Input
                  label="Area or Village Name"
                  placeholder="Enter area or village name"
                  value={(data.permanentArea as string) || ""}
                  onChange={(e) => updateData({ permanentArea: e.target.value })}
                  isRequired
                  errorMessage={errors.permanentArea}
                  isInvalid={!!errors.permanentArea}
                />
              </div>
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="flex items-center space-x-2 px-2">
            <Checkbox
              isSelected={(data.sameAsPermanent as boolean) || false}
              onValueChange={handleSameAddressChange}
            >
              Present address is same as permanent address
            </Checkbox>
          </div>

          {/* Present Address */}
          <div className={`${data.sameAsPermanent ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="rounded-lg bg-slate-50 p-4 shadow-inner">
              <LocationSelector
                dataSource="addressData"
                type="present"
                data={data}
                errors={errors}
                updateData={updateData}
                onLocationSelect={() => {}} // Not used in addressData mode
              />
              <div className="mt-4">
                <Input
                  label="Area or Village Name"
                  placeholder="Enter area or village name"
                  value={(data.presentArea as string) || ""}
                  onChange={(e) => updateData({ presentArea: e.target.value })}
                  isRequired
                  errorMessage={errors.presentArea}
                  isInvalid={!!errors.presentArea}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Health Issues */}
      <Textarea
        label="Do you have any physical or mental health issues?"
        placeholder="Please describe any health issues or write 'None' if you don't have any"
        value={(data.healthIssues as string) || ""}
        onChange={(e) => updateData({ healthIssues: e.target.value })}
        minRows={3}
        isRequired
        errorMessage={errors.healthIssues}
        isInvalid={!!errors.healthIssues}
      />
    </div>
  );
}
