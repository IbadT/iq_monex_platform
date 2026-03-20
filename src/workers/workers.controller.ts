import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkersDto } from './dto/create-workers.dto';
import { ChangeWorkerStatus } from './dto/change-worker-status.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post('')
  @Protected()
  async createWorker(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateWorkersDto,
  ) {
    return await this.workersService.createWorker(user.id, body.workers);
  }

  // установить статут работника в false
  @Post(':id/change-status')
  async changeWorkerActiveStatus(@Body() body: ChangeWorkerStatus) {
    return await this.workersService.changeWorkerActiveStatus(body.id);
  }

  @Get('')
  @Protected()
  async getUserWorkers(@CurrentUser() user: JwtPayload) {
    return await this.workersService.getUserWorkers(user.id);
  }

  @Get('roles')
  async getRoles() {
    return await this.workersService.getRoles();
  }

  @Post('roles')
  async createRole(@Body() body: CreateRoleDto) {
    return await this.workersService.createRole(body);
  }

  @Patch('')
  @Protected()
  async updateWorkers(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateWorkerDto,
  ) {
    return await this.workersService.updateWorkers(user.id, body);
  }
}
