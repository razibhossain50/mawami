export enum BiodataVisibilityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export const BIODATA_VISIBILITY_STATUS_DESCRIPTIONS = {
  [BiodataVisibilityStatus.ACTIVE]: 'Visible to other users',
  [BiodataVisibilityStatus.INACTIVE]: 'Hidden from other users'
};