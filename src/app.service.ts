import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return 'Pong';
  }

  async seedDefaultData() {
    return 'OK';
  }
}
