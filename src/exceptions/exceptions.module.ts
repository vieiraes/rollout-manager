import { Module, Global } from '@nestjs/common';
import { AppExceptionsService } from './app-exceptions.service';

@Global()
@Module({
  providers: [AppExceptionsService],
  exports: [AppExceptionsService],
})
export class ExceptionsModule {}