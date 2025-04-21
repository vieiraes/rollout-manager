import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NotebooksModule } from './notebooks/notebooks.module';
import { MovementsModule } from './movements/movements.module';
import { ExportModule } from './export/export.module';
import { PlacesModule } from './places/places.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { DateTransformInterceptor } from './interceptors/date-transform.interceptor';

@Module({
  imports: [
    PrismaModule,
    NotebooksModule,
    MovementsModule,
    ExportModule,
    PlacesModule,
    ExceptionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DateTransformInterceptor,
    },
  ],
})
export class AppModule { }