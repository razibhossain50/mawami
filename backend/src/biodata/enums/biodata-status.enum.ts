export enum BiodataStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  REJECTED = 'Rejected'
}

export const BIODATA_STATUS_DESCRIPTIONS = {
  [BiodataStatus.PENDING]: 'Under review by admin team',
  [BiodataStatus.ACTIVE]: 'Approved and visible to other users',
  [BiodataStatus.INACTIVE]: 'Temporarily hidden from public view',
  [BiodataStatus.REJECTED]: 'Rejected due to policy violations'
};