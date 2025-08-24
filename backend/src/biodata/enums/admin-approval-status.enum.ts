export enum BiodataApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved', 
  REJECTED = 'rejected',
  INACTIVE = 'inactive'
}

export const BIODATA_APPROVAL_STATUS_DESCRIPTIONS = {
  [BiodataApprovalStatus.PENDING]: 'Waiting for admin review',
  [BiodataApprovalStatus.APPROVED]: 'Approved by admin - ready to go live',
  [BiodataApprovalStatus.REJECTED]: 'Rejected by admin - needs corrections',
  [BiodataApprovalStatus.INACTIVE]: 'Deactivated by admin'
};