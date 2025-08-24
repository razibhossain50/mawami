import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorites.entity';
import { Biodata } from '../biodata/biodata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Biodata])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}