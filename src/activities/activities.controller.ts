import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AddActivityToUserDto } from '@/users/dto/add-activity-to-user.dto';
import { ApiGetActivitiesDocs } from './decorators/get-activities-docs.decorator';
import { ApiGetUserActivitiesDocs } from './decorators/get-user-activities-docs.decorator';
import { ApiAddUserActivityDocs } from './decorators/add-user-activity-docs.decorator';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

    // получить сферы деятельности
    @Get()
    @ApiGetActivitiesDocs()
    async getActivities() {
      return await this.activitiesService.getActivities();
    }
  
    // получить сверы деятельности пользователя
    @Get('users/:userId')
    @Protected()
    @ApiGetUserActivitiesDocs()
    async getUserActivities(
      @Param('userId', ParseUUIDPipe) userId: string,
    ) {
      return await this.activitiesService.getUserActivities(userId);
    }
  
    // добавить сферу деятельности пользователю
    @Post()
    @Protected()
    @ApiAddUserActivityDocs()
    async addUserActivity(
      @CurrentUser() user: JwtPayload,
      @Body() body: AddActivityToUserDto,
    ) {
      return await this.activitiesService.addUserActivity(user.id, body);
    }
}
