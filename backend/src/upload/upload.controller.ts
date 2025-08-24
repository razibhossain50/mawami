import {Controller,Post,UseInterceptors,UploadedFile,BadRequestException,UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('profilePicture', {
    ...new UploadService().getMulterConfig(),
  }))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileUrl = this.uploadService.generateFileUrl(file.filename);

    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      originalName: file.originalname,
      url: fileUrl,
      size: file.size,
    };
  }
}