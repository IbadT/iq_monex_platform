import { UserResponseDto } from '../dto/response/user-response.dto';

export class UserMapper {
  static toUserResponse(user: any): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.email,
      user.name,
      user.accountNumber,
      user.role,
      user.avatar || null,
    );
  }
}
