import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingQueryDto } from './dto/request/listing-query.dto';
import { CreateListingDto } from './dto/request/create-listing.dto';
import { UpdateListingDto } from './dto/request/update-listing.dto';
import { Protected } from '@/common/decorators/protected.decorator';
import { StatusQueryDto } from './dto/request/status-query.dto';
import { ApiChangeStatusDocs } from './decorators/api-change-status-docs.decorator';
import { ChangeListingStatusDto } from './dto/request/change-listing-status.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { CreateListingApiDocs } from './decorators/api-create-listing-docs.decorator';
import { ApiListingQueryDocs } from './decorators/api-listing-query-docs.decorator';
import { ApiListingByIdDocs } from './decorators/api-listing-by-id-docs.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MakeComplaintToListing } from './dto/request/make-complaint-to-listing.dto';
import { GetRecomentQueryDto } from './dto/request/get-recoment-query.dto';
import { ApiBulkRestoreDocs } from './decorators/api-bulk-restore-docs.decorator';
import { ApiComplaintDocs } from './decorators/api-complaint-docs.decorator';
import { ApiEditListingDocs } from './decorators/api-edit-listing-docs.decorator';
import { ApiDeleteListingDocs } from './decorators/api-delete-listing-docs.decorator';
import { ApiGetRecomendsDocs } from './decorators/api-get-recomends-docs.decorator';
import { ApiGetUserListingsDocs } from './decorators/api-get-user-listings-docs.decorator';
import { ListingResposeDto } from './dto/response/listing-response.dto';
import { CreateListingResponseDto } from './dto/response/create-listing-response.dto';
import { ChangeStatusResponseDto } from './dto/response/change-status-response.dto';
import { BulkRestoreResponseDto } from './dto/response/bulk-restore-response.dto';
import { CreateListingComplaintResponseDto } from './dto/response/create-listing-complaint-response.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('')
  @ApiListingQueryDocs()
  async listingList(@Query() query: ListingQueryDto) {
    // Если есть поисковый запрос, используем Elasticsearch
    if (query.search) {
      return await this.listingsService.searchListings(query);
    }
    // Иначе используем обычный поиск из БД
    return await this.listingsService.listingList(query);
  }

  @Get(':id')
  @ApiListingByIdDocs()
  async listingById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: StatusQueryDto,
  ): Promise<ListingResposeDto> {
    return await this.listingsService.listingById(id, query);
  }

  @Get(':listingId/recomends')
  @ApiGetRecomendsDocs()
  async getRecomendsByListingId(
    @Param('listingId') listingId: string,
    @Query() query: GetRecomentQueryDto,
  ) {
    return await this.listingsService.getRecomendsByListingId(listingId, query);
  }

  @Get('users/:user_id')
  @ApiGetUserListingsDocs()
  async listingsByUserId(
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ): Promise<ListingResposeDto[]> {
    return await this.listingsService.listingsByUserId(user_id);
  }

  // добавить specifications
  @Post('')
  @CreateListingApiDocs()
  @Protected()
  async createListing(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateListingDto,
  ): Promise<CreateListingResponseDto> {
    return await this.listingsService.createListing(user.id, body);
  }

  // изменить статус объявления
  @Post('change-status')
  @ApiChangeStatusDocs()
  @Protected()
  async changeListingStatus(
    @CurrentUser() user: JwtPayload,
    @Body() body: ChangeListingStatusDto,
  ): Promise<ChangeStatusResponseDto> {
    return await this.listingsService.changeListingStatus(user.id, body);
  }

  // Переместить ВСЕ объявления из ARCHIVE в PUBLISHED
  @Post('bulk-restore')
  @Protected()
  @ApiBulkRestoreDocs()
  async bulkRestore(
    @CurrentUser() user: JwtPayload,
  ): Promise<BulkRestoreResponseDto> {
    return await this.listingsService.bulkRestore(user.id);
  }

  @Post('complaint')
  @Protected()
  @ApiComplaintDocs()
  async makeComplaintToListing(
    @CurrentUser() user: JwtPayload,
    @Body() body: MakeComplaintToListing,
  ): Promise<CreateListingComplaintResponseDto> {
    return await this.listingsService.makeComplaintToListing(user.id, body);
  }

  // редактировать объявление
  // TODO: имплементировать логику
  // TODO: добавить документацию
  @Patch('edit/:id')
  @Protected()
  @ApiEditListingDocs()
  async editListingById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateListingDto,
  ) {
    return await this.listingsService.editListingById(id, user, body);
  }

  @Delete(':id')
  @Protected()
  @ApiDeleteListingDocs()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteListingById(
    @CurrentUser() user: JwtPayload,
    @Query() query: StatusQueryDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.listingsService.deleteListingById(id, user, query);
  }

  // ??? получить подробную информацию по объявлению ???

  // ??? ЗАМЕТКИ ???
}
