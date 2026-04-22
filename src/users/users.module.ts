import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';
import { VerificationDocumentsService } from './verification-documents.service';
import { VerificationDocumentsController, AdminVerificationDocumentsController } from './verification-documents.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    UsersController,
    UserPreferencesController,
    VerificationDocumentsController,
    AdminVerificationDocumentsController,
  ],
  providers: [
    UsersService,
    UserPreferencesService,
    VerificationDocumentsService,
  ],
  exports: [
    UsersService,
    UserPreferencesService,
    VerificationDocumentsService,
  ],
})
export class UsersModule {}
