import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winston from 'winston';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@modules/auth/auth.module';
import { CartModule } from '@modules/cart/cart.module';
import { ColorModule } from '@modules/color/color.module';
import { OrderModule } from '@modules/order/order.module';
import { ProductModule } from '@modules/product/product.module';
import { SizeModule } from '@modules/size/size.module';
import { UserModule } from '@modules/user/user.module';

import Configs from '@shared/config';
import { DebuggerModule } from '@shared/debugger/debugger.module';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';
import { MongoDriverErrorFilter } from '@shared/filters/mongo-driver-error.filter';
import { MongooseErrorFilter } from '@shared/filters/mongoose-error.filter';
import { JwtAuthGuard } from '@shared/guards/auth.guard';
import { RolesGuard } from '@shared/guards/roles.guard';
import { LoggerModule } from '@shared/logger/logger.module';
import { LoggerMiddleware } from '@shared/middlewares/http-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    WinstonModule.forRootAsync({
      imports: [DebuggerModule],
      useFactory: (configService: ConfigService) => {
        return {
          transports: [
            new winston.transports.Console({
              level: configService.get<string>('LOG_LEVEL', 'info'),
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.prettyPrint(),
                nestWinstonModuleUtilities.format.nestLike(),
              ),
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-paginate-v2'));
          connection.plugin(require('mongoose-autopopulate'));
          Logger.debug(
            `App connected to MongoDB on ${config.get<string>('DATABASE_URL')}`,
            'MONGODB',
          );
          return connection;
        },
      }),
    }),
    AuthModule,
    UserModule,
    LoggerModule,
    ProductModule,
    ColorModule,
    SizeModule,
    CartModule,
    OrderModule,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoDriverErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongooseErrorFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
