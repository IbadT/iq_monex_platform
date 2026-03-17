import { PartialType } from '@nestjs/swagger';
import { CreateWorkersDto } from './create-workers.dto';
// import { CreateWorkerDto } from './create-worker.dto';

export class UpdateWorkerDto extends PartialType(CreateWorkersDto) {}
