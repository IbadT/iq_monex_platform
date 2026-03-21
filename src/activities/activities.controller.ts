import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AddActivityToUserDto } from '@/users/dto/add-activity-to-user.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

    // получить сферы деятельности
    @Get()
    async getActivities() {
      return await this.activitiesService.getActivities();
    }
  
    // получить сверы деятельности пользователя
    @Get('users/:userId')
    @Protected()
    async getUserActivities(
      @Param('userId', ParseUUIDPipe) userId: string,
    ) {
      return await this.activitiesService.getUserActivities(userId);
    }
  
    // добавить сферу деятельности пользователю
    @Post()
    @Protected()
    async addUserActivity(
      @CurrentUser() user: JwtPayload,
      @Body() body: AddActivityToUserDto,
    ) {
      return await this.activitiesService.addUserActivity(user.id, body);
    }
}
