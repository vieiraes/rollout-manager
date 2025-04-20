import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service'; // Alterado para plural para manter consistência
import { MovementsController } from './movements.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MovementsController],
  providers: [MovementsService], // Alterado para plural
  exports: [MovementsService], // Alterado para plural
})
export class MovementsModule {}
