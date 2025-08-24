import { Controller, Post, Delete, Get, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':biodataId')
  @HttpCode(HttpStatus.CREATED)
  async addToFavorites(@Request() req, @Param('biodataId') biodataId: string) {
    const userId = req.user.id;
    const favorite = await this.favoritesService.addToFavorites(userId, parseInt(biodataId));
    return {
      success: true,
      message: 'Added to favorites successfully',
      data: favorite
    };
  }

  @Delete(':biodataId')
  @HttpCode(HttpStatus.OK)
  async removeFromFavorites(@Request() req, @Param('biodataId') biodataId: string) {
    const userId = req.user.id;
    await this.favoritesService.removeFromFavorites(userId, parseInt(biodataId));
    return {
      success: true,
      message: 'Removed from favorites successfully'
    };
  }

  @Get()
  async getUserFavorites(@Request() req) {
    const userId = req.user.id;
    const favorites = await this.favoritesService.getUserFavorites(userId);
    return {
      success: true,
      data: favorites
    };
  }

  @Get('check/:biodataId')
  async checkIsFavorite(@Request() req, @Param('biodataId') biodataId: string) {
    const userId = req.user.id;
    const isFavorite = await this.favoritesService.isFavorite(userId, parseInt(biodataId));
    return {
      success: true,
      isFavorite
    };
  }

  @Get('count')
  async getFavoriteCount(@Request() req) {
    const userId = req.user.id;
    const count = await this.favoritesService.getFavoriteCount(userId);
    return {
      success: true,
      count
    };
  }
}