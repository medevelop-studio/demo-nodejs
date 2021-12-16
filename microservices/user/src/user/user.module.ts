import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../common/entity/user.entity';
import { Env } from '../common/dictionary/env';
import { DisplaySettings } from '../common/entity/display-settings.entity';
import { UserLog } from '../common/entity/user-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DisplaySettings, UserLog]),
    JwtModule.register({
      secret: Env.JWT_SECRET,
      signOptions: { expiresIn: (Env.JWT_EXPIRATION_IN_SECONDS) + 's' },
    }),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
