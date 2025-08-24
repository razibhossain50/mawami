import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { BiodataApprovalStatus } from '../enums/admin-approval-status.enum';
import { BiodataVisibilityStatus } from '../enums/user-visibility-status.enum';

export class CreateBiodataDto {
  @IsNumber()
  @IsOptional()
  step?: number;

  @IsNumber()
  partnerAgeMin: number;

  @IsNumber()
  partnerAgeMax: number;

  @IsBoolean()
  @IsOptional()
  sameAsPermanent?: boolean;

  @IsString()
  religion: string;

  @IsString()
  biodataType: string;

  @IsString()
  maritalStatus: string;

  @IsString()
  dateOfBirth: string;

  @IsNumber()
  age: number;

  @IsString()
  height: string;

  @IsNumber()
  weight: number;

  @IsString()
  complexion: string;

  @IsString()
  profession: string;

  @IsString()
  bloodGroup: string;

  @IsString()
  permanentCountry: string;

  @IsString()
  permanentDivision: string;

  @IsString()
  permanentZilla: string;

  @IsString()
  permanentUpazilla: string;

  @IsString()
  permanentArea: string;

  @IsString()
  presentCountry: string;

  @IsString()
  presentDivision: string;

  @IsString()
  presentZilla: string;

  @IsString()
  presentUpazilla: string;

  @IsString()
  presentArea: string;

  @IsString()
  healthIssues: string;

  @IsString()
  educationMedium: string;

  @IsString()
  highestEducation: string;

  @IsString()
  instituteName: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsNumber()
  passingYear: number;

  @IsString()
  result: string;

  @IsString()
  economicCondition: string;

  @IsString()
  fatherName: string;

  @IsString()
  fatherProfession: string;

  @IsString()
  fatherAlive: string;

  @IsString()
  motherName: string;

  @IsString()
  motherProfession: string;

  @IsString()
  motherAlive: string;

  @IsNumber()
  brothersCount: number;

  @IsNumber()
  sistersCount: number;

  @IsString()
  @IsOptional()
  familyDetails?: string;

  @IsString()
  @IsOptional()
  partnerComplexion?: string;

  @IsString()
  @IsOptional()
  partnerHeight?: string;

  @IsString()
  @IsOptional()
  partnerEducation?: string;

  @IsString()
  @IsOptional()
  partnerProfession?: string;

  @IsString()
  @IsOptional()
  partnerLocation?: string;

  @IsString()
  @IsOptional()
  partnerDetails?: string;

  @IsString()
  fullName: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsString()
  email: string;

  @IsString()
  guardianMobile: string;

  @IsString()
  ownMobile: string;

  @IsOptional()
  completedSteps?: number[];

  @IsEnum(BiodataApprovalStatus)
  @IsOptional()
  biodataApprovalStatus?: BiodataApprovalStatus;

  @IsEnum(BiodataVisibilityStatus)
  @IsOptional()
  biodataVisibilityStatus?: BiodataVisibilityStatus;
}
