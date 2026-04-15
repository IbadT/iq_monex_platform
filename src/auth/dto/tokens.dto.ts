export class TokensDto {
  accessToken: string;
  refreshToken: string;
  user: UserTokenDto;

  constructor(accessToken: string, refreshToken: string, user: UserTokenDto) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}

export class UserTokenDto {
  id: string;
  email: string;
  name: string;

  constructor(id: string, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}
