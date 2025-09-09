import { Module } from '@nestjs/common';
import { dataSourceOptions } from './configs';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceOptions,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10_000,
          limit: 10,
        },
        {
          name: 'long',
          ttl: 60_000,
          limit: 20,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
