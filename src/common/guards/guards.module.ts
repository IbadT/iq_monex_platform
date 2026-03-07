import { Module, Global } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { PermissionsGuard } from './permissions.guard';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule, JwtAuthModule],
  providers: [JwtAuthGuard, RolesGuard, PermissionsGuard],
  exports: [JwtAuthGuard, RolesGuard, PermissionsGuard],
})
export class GuardsModule {}
