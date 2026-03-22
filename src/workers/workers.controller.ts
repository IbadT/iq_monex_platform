import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkersDto } from './dto/create-workers.dto';
import { ChangeWorkerStatus } from './dto/change-worker-status.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { ApiCreateWorkerDocs } from './decorators/api-create-worker-docs.decorator';
import { ApiChangeWorkerStatusDocs } from './decorators/api-change-worker-status-docs.decorator';
import { ApiGetUserWorkersDocs } from './decorators/api-get-user-workers-docs.decorator';
import { ApiGetRolesDocs } from './decorators/api-get-roles-docs.decorator';
import { ApiCreateRoleDocs } from './decorators/api-create-role-docs.decorator';
import { ApiUpdateWorkersDocs } from './decorators/api-update-workers-docs.decorator';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post('')
  @Protected()
  @ApiCreateWorkerDocs()
  async createWorker(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateWorkersDto,
  ) {
    return await this.workersService.createWorker(user.id, body.workers);
  }

  // установить статут работника в false
  @Post(':id/change-status')
  @Protected()
  @ApiChangeWorkerStatusDocs()
  async changeWorkerActiveStatus(
    @CurrentUser() user: JwtPayload,
    @Body() body: ChangeWorkerStatus
  ) {
    return await this.workersService.changeWorkerActiveStatus(body.id, user.id);
  }

  @Get('')
  @Protected()
  @ApiGetUserWorkersDocs()
  async getUserWorkers(@CurrentUser() user: JwtPayload) {
    return await this.workersService.getUserWorkers(user.id);
  }

  @Get('roles')
  @ApiGetRolesDocs()
  async getRoles() {
    return await this.workersService.getRoles();
  }

  @Post('roles')
  @ApiCreateRoleDocs()
  async createRole(@Body() body: CreateRoleDto) {
    return await this.workersService.createRole(body);
  }

  @Patch('')
  @Protected()
  @ApiUpdateWorkersDocs()
  async updateWorkers(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateWorkerDto,
  ) {
    return await this.workersService.updateWorkers(user.id, body);
  }
}
