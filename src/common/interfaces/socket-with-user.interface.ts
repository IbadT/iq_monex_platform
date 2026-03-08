import { Socket } from 'socket.io';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

export interface SocketWithUser extends Socket {
  user: JwtPayload;
}
