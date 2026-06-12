import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { seconds } from './utils';
import { EmailVerifyModule } from './email_verify/email_verify.module';
import { AddressModule } from './address/address.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    /*  MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URI',
          process.env.MONGO_URI || '',
        ),
      }),
    }), */
    UsersModule,
    AuthModule,
    DbModule,

    ThrottlerModule.forRoot({
      errorMessage: () => 'limite de requisição excedido',
      throttlers: [
        {
          name: 'default',
          ttl: seconds(3),
          limit: 2,
        },
        {
          name: 'other',
          ttl: seconds(3),
          limit: 22,
        },
      ],
    }),
    EmailVerifyModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
