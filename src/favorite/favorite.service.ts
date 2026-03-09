import { ChangeListingStatusDto } from '@/listings/dto/request/change-listing-status.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoriteService {
  async getList() {
    return;
  }

  async getById() {
    return;
  }

  async create(body: ChangeListingStatusDto) {
    return body;
  }

  async delete() {
    return;
  }
}
