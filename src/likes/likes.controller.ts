import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ApiToggleLikeDocs } from '@/likes/decorators/api-toggle-like-docs.decorator';
import { SendLikeDto } from '@/listings/dto/request/send-like.dto';
import { ApiGetListingLikesDocs } from '@/likes/decorators/api-get-listing-likes-docs.decorator';
import { ToggleLikeResponseDto } from './dto/response/toggle-like-response.dto';
import { GetLikesResponseDto } from './dto/response/get-likes-response.dto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('')
  @ApiToggleLikeDocs()
  @Protected()
  async toggleLike(
    @Body() body: SendLikeDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<ToggleLikeResponseDto> {
    return await this.likesService.toggleLike(body.listing_id, user.id);
  }

  @Get('listings/:listingId')
  @ApiGetListingLikesDocs()
  async getListingLikes(
    @Param('listingId', ParseUUIDPipe) listingId: string,
  ): Promise<GetLikesResponseDto> {
    return await this.likesService.getListingLikes(listingId);
  }
}
