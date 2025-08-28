'use client';
import { Input, Card, CardBody, Tooltip } from "@heroui/react";
import { Info, Upload } from "lucide-react";
import { useState } from "react";
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/error-handler';
import { apiClient } from '@/lib/api-client';
import { FileUploadResponse } from '@/types/api';

interface ContactInfoStepProps {
  data: Record<string, unknown>;
  errors: Record<string, string>;
  updateData: (data: Partial<Record<string, unknown>>) => void;
}

export function ContactInfoStep({ data, errors, updateData }: ContactInfoStepProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert("Please upload only JPEG or PNG images.");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }

      try {
        setIsUploading(true);
        
        // Upload file to backend using API client
        const result = await apiClient.uploadFile('/api/upload/profile-picture', file, 'profilePicture') as FileUploadResponse;
        
        setUploadedFile(file);
        // Store the URL returned from backend
        updateData({ profilePicture: result.url });
        
        logger.debug('File uploaded successfully', result, 'Contact-info-step');
      } catch (error) {
        const appError = handleApiError(error, 'Component');
            logger.error('Upload error', appError, 'Contact-info-step');
        alert('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-4 border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-lg" />
          Contact Information
        </h2>
        <p className="text-slate-500 mt-1">Provide your contact details securely</p>
      </div>

      <div className="space-y-8">


        {/* Contact details grid */}
        <div className="grid gap-4">
          {/* Name with Admin Note */}
          <div className="col-span-2">
            <Input
              label="Your full name"
              placeholder="Enter full name"
              value={(data.fullName as string) || ""}
              onChange={(e) => updateData({ fullName: e.target.value })}
              isRequired
              errorMessage={errors.fullName}
              isInvalid={!!errors.fullName}
              description={
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Info className="w-3 h-3" />
                  Only visible for admin
                </div>
              }
              endContent={
                <Tooltip content="Only visible for admin">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                </Tooltip>
              }
            />
          </div>

          {/* Profile Picture */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Profile Picture</span>
              <Tooltip content="Only visible for admin and who bought the connection. Only JPEG/PNG Image">
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
              </Tooltip>
            </div>

            <Card className={`border-2 border-dashed transition-colors ${
              isUploading ? 'border-blue-300 bg-blue-50' : 
              uploadedFile ? 'border-emerald-300 bg-emerald-50' : 
              'border-slate-300 hover:border-slate-400'
            }`}>
              <CardBody className="p-6">
                <div className="text-center">
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-sm font-medium text-blue-900">Uploading...</p>
                      <p className="text-xs text-blue-600">Please wait while we upload your image</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-emerald-900">{uploadedFile.name}</p>
                      <p className="text-xs text-emerald-600">✓ File uploaded successfully</p>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          updateData({ profilePicture: null });
                        }}
                        className="text-xs text-slate-500 hover:text-slate-700 underline"
                      >
                        Upload different image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <label htmlFor="profilePicture" className="cursor-pointer">
                          <span className="text-primary hover:text-primary/80 font-medium">
                            Click to upload
                          </span>
                          <span className="text-slate-500"> or drag and drop</span>
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">PNG or JPG (max. 5MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profilePicture"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </CardBody>
            </Card>

            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Only visible for admin and who bought the connection
            </p>
          </div>

          {/* Email */}
          <div className="col-span-2">
              <Input
                className="col-span-2"
                type="email"
                label="Email"
                placeholder="Enter email address"
                value={(data.email as string) || ""}
                onChange={(e) => updateData({ email: e.target.value })}
                isRequired
                errorMessage={errors.email}
                isInvalid={!!errors.email}
              />
          </div>

          {/* Guardian's Mobile */}
          <div className="col-span-2">
            <Input
              type="tel"
              label="Guardian's Mobile Number"
              placeholder="Enter guardian's mobile number"
              value={(data.guardianMobile as string) || ""}
              onChange={(e) => updateData({ guardianMobile: e.target.value })}
              isRequired
              errorMessage={errors.guardianMobile}
              isInvalid={!!errors.guardianMobile}
            />
          </div>

          {/* Own Mobile */}
          <div className="col-span-2">
            <Input
              type="tel"
              label="Own Mobile Number"
              placeholder="Enter your mobile number"
              value={(data.ownMobile as string) || ""}
              onChange={(e) => updateData({ ownMobile: e.target.value })}
              isRequired
              errorMessage={errors.ownMobile}
              isInvalid={!!errors.ownMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
