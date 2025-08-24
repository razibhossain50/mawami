import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Biodata } from './biodata.entity';
import { ProfileView } from './entities/profile-view.entity';
import { CreateBiodataDto } from './dto/create-biodata.dto';
import { UpdateBiodataDto } from './dto/update-biodata.dto';
import { BiodataApprovalStatus } from './enums/admin-approval-status.enum';
import { BiodataVisibilityStatus } from './enums/user-visibility-status.enum';

@Injectable()
export class BiodataService {
  constructor(
    @InjectRepository(Biodata)
    private biodataRepository: Repository<Biodata>,
    @InjectRepository(ProfileView)
    private profileViewRepository: Repository<ProfileView>
  ) { }

  async create(createBiodataDto: CreateBiodataDto & { userId: number }) {
    console.log('=== BiodataService.create ===');
    console.log('Input DTO:', createBiodataDto);
    console.log('User ID in DTO:', createBiodataDto.userId);

    const biodata = this.biodataRepository.create(createBiodataDto);
    console.log('Created biodata entity:', biodata);
    console.log('Biodata userId before save:', biodata.userId);

    const savedBiodata = await this.biodataRepository.save(biodata);
    console.log('Saved biodata:', savedBiodata);
    console.log('Saved biodata userId:', savedBiodata.userId);

    return savedBiodata;
  }

  async findAll() {
    const allBiodatas = await this.biodataRepository.find({
      relations: ['user']
    });

    // Only show biodatas that are approved and active (visible to public)
    return allBiodatas.filter(biodata => biodata.isVisibleToPublic());
  }

  async findOne(id: number) {
    const biodata = await this.biodataRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!biodata || !biodata.isVisibleToPublic()) {
      return null;
    }

    return biodata;
  }

  findByUserId(userId: number) {
    return this.biodataRepository.findOne({
      where: { userId },
      relations: ['user']
    });
  }

  // Internal method to find biodata without status filtering (for admin/owner access)
  private findOneInternal(id: number) {
    return this.biodataRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  // Admin method to get all biodatas regardless of status
  // Temporarily show all biodatas for debugging
  async findAllForAdmin() {
    const allBiodatas = await this.biodataRepository.find({
      relations: ['user'],
      order: { id: 'DESC' }
    });

    console.log('=== Admin findAllForAdmin Debug ===');
    console.log('Total biodatas found:', allBiodatas.length);

    if (allBiodatas.length > 0) {
      console.log('Sample biodata fields:', {
        id: allBiodatas[0].id,
        fullName: allBiodatas[0].fullName,
        completedSteps: allBiodatas[0].completedSteps,
        biodataApprovalStatus: allBiodatas[0].biodataApprovalStatus,
        biodataVisibilityStatus: allBiodatas[0].biodataVisibilityStatus,
        // Check if old status field still exists
        status: (allBiodatas[0] as any).status
      });

      // Log all field names to see what's available
      console.log('Available fields:', Object.keys(allBiodatas[0]));
    } else {
      console.log('No biodatas found in database');
    }

    // Handle both old and new column structures
    // If new columns don't exist, map from old status field
    const processedBiodatas = allBiodatas.map(biodata => {
      // If new columns don't exist, set defaults based on old status
      if (!biodata.biodataApprovalStatus && (biodata as any).status) {
        const oldStatus = (biodata as any).status;
        // Map old status to new approval status
        switch (oldStatus) {
          case 'Active':
            biodata.biodataApprovalStatus = BiodataApprovalStatus.APPROVED;
            break;
          case 'Pending':
            biodata.biodataApprovalStatus = BiodataApprovalStatus.PENDING;
            break;
          case 'Rejected':
            biodata.biodataApprovalStatus = BiodataApprovalStatus.REJECTED;
            break;
          case 'Inactive':
            biodata.biodataApprovalStatus = BiodataApprovalStatus.INACTIVE;
            break;
          default:
            biodata.biodataApprovalStatus = BiodataApprovalStatus.PENDING;
        }
      }

      // Set default visibility status if not exists
      if (!biodata.biodataVisibilityStatus) {
        biodata.biodataVisibilityStatus = BiodataVisibilityStatus.ACTIVE;
      }

      return biodata;
    });

    console.log('Processed biodatas with status mapping');
    return processedBiodatas;
  }

  // Owner method to get their own biodata regardless of status
  findOneForOwner(id: number) {
    return this.biodataRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  // Admin method to update biodata approval status
  async updateApprovalStatus(id: number, approvalStatus: BiodataApprovalStatus) {
    await this.biodataRepository.update(id, { biodataApprovalStatus: approvalStatus });
    return this.findOneInternal(id);
  }

  // User method to toggle their biodata visibility
  async toggleUserVisibility(userId: number): Promise<{ success: boolean; message: string; newStatus?: string }> {
    const biodata = await this.findByUserId(userId);

    if (!biodata) {
      return { success: false, message: 'Biodata not found' };
    }

    if (!biodata.canUserToggle()) {
      return {
        success: false,
        message: 'You cannot toggle your biodata visibility. Your biodata must be approved by admin first.'
      };
    }

    // Toggle user visibility
    const newVisibilityStatus = biodata.biodataVisibilityStatus === BiodataVisibilityStatus.ACTIVE
      ? BiodataVisibilityStatus.INACTIVE
      : BiodataVisibilityStatus.ACTIVE;

    await this.biodataRepository.update(biodata.id, { biodataVisibilityStatus: newVisibilityStatus });

    // Get updated biodata to return new effective status
    const updatedBiodata = await this.findByUserId(userId);
    const effectiveStatus = updatedBiodata?.getEffectiveStatus();

    return {
      success: true,
      message: newVisibilityStatus === BiodataVisibilityStatus.ACTIVE
        ? 'Biodata is now visible to others'
        : 'Biodata is now hidden from others',
      newStatus: effectiveStatus
    };
  }

  update(id: number, updateBiodataDto: UpdateBiodataDto) {
    return this.biodataRepository.update(id, updateBiodataDto);
  }

  async updateByUserId(userId: number, updateBiodataDto: UpdateBiodataDto) {
    try {
      console.log('=== updateByUserId called ===');
      console.log('userId:', userId);
      console.log('updateBiodataDto:', JSON.stringify(updateBiodataDto, null, 2));

      // First check if user has existing biodata
      const existingBiodata = await this.findByUserId(userId);
      console.log('existingBiodata found:', !!existingBiodata);

      if (existingBiodata) {
        // Update existing biodata
        console.log('Updating existing biodata with ID:', existingBiodata.id);
        await this.biodataRepository.update(existingBiodata.id, updateBiodataDto);
        const result = await this.findOneInternal(existingBiodata.id);
        console.log('Update successful, returning result');
        return result;
      } else {
        // Create new biodata if none exists
        console.log('Creating new biodata');
        const biodata = this.biodataRepository.create({ ...updateBiodataDto, userId });
        const result = await this.biodataRepository.save(biodata);
        console.log('Create successful, returning result');
        return result;
      }
    } catch (error) {
      console.error('Error in updateByUserId:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  // Validate that user owns the biodata before allowing operations
  async validateOwnership(biodataId: number, userId: number): Promise<boolean> {
    const biodata = await this.findOneInternal(biodataId);
    return !!(biodata && biodata.userId && biodata.userId === userId);
  }

  remove(id: number) {
    return this.biodataRepository.delete(id);
  }

  async searchBiodatas(filters: {
    gender?: string;
    maritalStatus?: string;
    location?: string;
    biodataNumber?: string;
    ageMin?: number;
    ageMax?: number;
    page?: number;
    limit?: number;
  }) {
    try {
      console.log('=== searchBiodatas called ===');
      console.log('filters:', JSON.stringify(filters, null, 2));

      const { gender, maritalStatus, location, biodataNumber, ageMin, ageMax, page = 1, limit = 6 } = filters;

      // Build query with filters - get all biodatas first, then filter by effective status
      const queryBuilder = this.biodataRepository
        .createQueryBuilder('biodata')
        .leftJoinAndSelect('biodata.user', 'user');

      // Filter by biodata number (ID)
      if (biodataNumber) {
        queryBuilder.andWhere('biodata.id = :id', { id: parseInt(biodataNumber) });
      }

      // Filter by gender (biodataType)
      if (gender && gender !== 'all') {
        queryBuilder.andWhere('biodata.biodataType = :gender', { gender });
      }

      // Filter by marital status
      if (maritalStatus && maritalStatus !== 'all') {
        queryBuilder.andWhere('biodata.maritalStatus = :maritalStatus', { maritalStatus });
      }

      // Filter by location (search in present or permanent address)
      if (location) {
        queryBuilder.andWhere(
          '(biodata.presentCountry ILIKE :location OR biodata.presentDivision ILIKE :location OR biodata.presentZilla ILIKE :location OR biodata.permanentCountry ILIKE :location OR biodata.permanentDivision ILIKE :location OR biodata.permanentZilla ILIKE :location)',
          { location: `%${location}%` }
        );
      }

      // Filter by age range
      if (ageMin) {
        queryBuilder.andWhere('biodata.age >= :ageMin', { ageMin });
      }
      if (ageMax) {
        queryBuilder.andWhere('biodata.age <= :ageMax', { ageMax });
      }

      // Order by creation date (newest first)
      queryBuilder.orderBy('biodata.id', 'DESC');

      // Get all matching biodatas
      const allBiodatas = await queryBuilder.getMany();

      // Filter by effective status (only show biodatas that are approved and active)
      const activeBiodatas = allBiodatas.filter(biodata => biodata.isVisibleToPublic());

      // Apply pagination to filtered results
      const totalCount = activeBiodatas.length;
      const skip = (page - 1) * limit;
      const biodatas = activeBiodatas.slice(skip, skip + limit);

      console.log(`Found ${biodatas.length} biodatas out of ${totalCount} total`);

      return {
        data: biodatas,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      console.error('Error in searchBiodatas:', error);
      throw error;
    }
  }

  // For multi-step form: update step and partial data
  async updateStep(id: number, step: number, partialData: UpdateBiodataDto) {
    await this.biodataRepository.update(id, { ...partialData, step });
    return this.findOne(id);
  }

  // Profile view tracking methods
  async trackProfileView(biodataId: number, viewerId?: number, ipAddress?: string, userAgent?: string) {
    try {
      // Check if biodata exists
      const biodata = await this.findOneInternal(biodataId);
      if (!biodata) {
        throw new Error('Biodata not found');
      }

      // Don't count views from the profile owner
      if (viewerId && biodata.userId === viewerId) {
        return { counted: false, reason: 'Owner view not counted' };
      }

      // Check if this user/IP has already viewed this profile recently (within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      let existingView;
      if (viewerId) {
        // For logged-in users, check by viewerId
        existingView = await this.profileViewRepository
          .createQueryBuilder('view')
          .where('view.biodataId = :biodataId', { biodataId })
          .andWhere('view.viewerId = :viewerId', { viewerId })
          .andWhere('view.viewedAt >= :twentyFourHoursAgo', { twentyFourHoursAgo })
          .getOne();
      } else if (ipAddress) {
        // For anonymous users, check by IP address
        existingView = await this.profileViewRepository
          .createQueryBuilder('view')
          .where('view.biodataId = :biodataId', { biodataId })
          .andWhere('view.viewerId IS NULL')
          .andWhere('view.ipAddress = :ipAddress', { ipAddress })
          .andWhere('view.viewedAt >= :twentyFourHoursAgo', { twentyFourHoursAgo })
          .getOne();
      }

      if (existingView) {
        return { counted: false, reason: 'Already viewed within 24 hours' };
      }

      // Create new profile view record
      const profileView = this.profileViewRepository.create({
        biodataId,
        viewerId,
        ipAddress,
        userAgent
      });

      await this.profileViewRepository.save(profileView);

      // Increment view count on biodata
      await this.biodataRepository.increment({ id: biodataId }, 'viewCount', 1);

      return { counted: true, reason: 'View counted successfully' };
    } catch (error) {
      console.error('Error tracking profile view:', error);
      throw error;
    }
  }

  // Get profile view count for a specific biodata
  async getProfileViewCount(biodataId: number): Promise<number> {
    const biodata = await this.findOneInternal(biodataId);
    return biodata?.viewCount || 0;
  }

  // Get profile view count for a user's own biodata
  async getUserProfileViewCount(userId: number): Promise<number> {
    const biodata = await this.findByUserId(userId);
    return biodata?.viewCount || 0;
  }

  // Get detailed view statistics for a user's biodata
  async getUserProfileViewStats(userId: number) {
    const biodata = await this.findByUserId(userId);
    if (!biodata) {
      return { totalViews: 0, recentViews: 0, viewsThisMonth: 0 };
    }

    const totalViews = biodata.viewCount || 0;

    // Get views from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentViews = await this.profileViewRepository
      .createQueryBuilder('view')
      .where('view.biodataId = :biodataId', { biodataId: biodata.id })
      .andWhere('view.viewedAt >= :sevenDaysAgo', { sevenDaysAgo })
      .getCount();

    // Get views from this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const viewsThisMonth = await this.profileViewRepository
      .createQueryBuilder('view')
      .where('view.biodataId = :biodataId', { biodataId: biodata.id })
      .andWhere('view.viewedAt >= :startOfMonth', { startOfMonth })
      .getCount();

    return {
      totalViews,
      recentViews,
      viewsThisMonth
    };
  }
}
