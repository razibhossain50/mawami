import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { UpdatePasswordDto } from './update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async findAll() {
    const users = await this.userRepository.find();
    // Return users without passwords
    return users.map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { fullName, email, password, confirmPassword, role } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'user' // Use provided role or default to 'user'
    });

    const savedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it's already in use by another user
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already in use');
      }
    }

    // Update user fields
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = updatePasswordDto;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    // Find the user with password
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedNewPassword;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deletion of superadmin accounts (optional safety check)
    if (user.role === 'superadmin') {
      throw new BadRequestException('Cannot delete superadmin accounts');
    }

    // Check if user has biodata and handle it
    const biodataRepository = this.userRepository.manager.getRepository('Biodata');
    const userBiodata = await biodataRepository.find({ where: { userId: id } });
    
    if (userBiodata.length > 0) {
      console.log(`User ${id} has ${userBiodata.length} biodata record(s). Deleting biodata first...`);
      // Delete all biodata records for this user first
      await biodataRepository.delete({ userId: id });
    }

    await this.userRepository.remove(user);
    return { 
      message: 'User deleted successfully', 
      deletedUser: { id: user.id, email: user.email, username: user.username },
      deletedBiodataCount: userBiodata.length
    };
  }
}
