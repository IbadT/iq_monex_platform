import { RoleResponseDto } from '../dto/response/role-response.dto';
import { UserWorkerResponseDto } from '../dto/response/worker-response.dto';
import { WorkerEntity } from '../entities/worker.entity';

export class UserWorkerMapper {
  static toResponse = (
    userWorkers: WorkerEntity[],
  ): UserWorkerResponseDto[] => {
    return userWorkers.map((worker: WorkerEntity) => {
      const roleEntity = worker.role;

      const role = new RoleResponseDto(
        roleEntity.id,
        roleEntity.code,
        roleEntity.role,
        roleEntity.type,
      );

      return new UserWorkerResponseDto(
        worker.id,
        worker.name,
        worker.email,
        worker.phone,
        worker.roleId,
        worker.userId,
        worker.isActive,
        role,
      );
    });
  };
}
