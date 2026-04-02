import { UserResponseDto } from '@/users/dto/response/user-response.dto';
import { PickType } from '@nestjs/swagger';

export class UserListingResponseDto extends PickType(UserResponseDto, [
  'id',
  'name',
]) {
  avatar?: string | null;
}
