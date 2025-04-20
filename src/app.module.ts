import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { NotebooksModule } from './notebooks/notebooks.module';
import { MovementsModule } from './movements/movements.module';
import { ExportModule } from './export/export.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    PrismaModule,
    NotebooksModule,
    MovementsModule,
    ExportModule,
    RoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }