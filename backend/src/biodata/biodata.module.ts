import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Biodata } from './biodata.entity';
import { ProfileView } from './entities/profile-view.entity';
import { BiodataService } from './biodata.service';
import { BiodataController } from './biodata.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Biodata, ProfileView])],
  providers: [BiodataService],
  controllers: [BiodataController],
  exports: [BiodataService],
})
export class BiodataModule {}
