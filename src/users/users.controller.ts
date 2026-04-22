import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/block')
  block(@Param('id') id: string) {
    return this.usersService.block(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/unblock')
  unblock(@Param('id') id: string) {
    return this.usersService.unblock(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/export')
  async exportData(
    @Param('id') id: string,
    @CurrentUser() user: AuthUserPayload,
  ) {
    // Check authorization: User can only export their own data, or must be an ADMIN
    if (user.sub !== id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You are not authorized to export this user\'s data');
    }

    try {
      const exportData = await this.usersService.exportPersonalData(id);
      
      // Ensure exports directory exists
      const exportsDir = path.join(process.cwd(), 'exports');
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir);
      }

      const filename = `export-${id}-${crypto.randomUUID()}.json`;
      const filepath = path.join(exportsDir, filename);

      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));

      return {
        message: 'Export generated successfully',
        downloadLink: `/users/export/download/${filename}`,
        expiresIn: '24 hours',
      };
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to generate export');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('export/download/:filename')
  async downloadExport(
    @Param('filename') filename: string,
    @Res() res: Response,
    @CurrentUser() user: AuthUserPayload,
  ) {
    const filepath = path.join(process.cwd(), 'exports', filename);

    if (!fs.existsSync(filepath)) {
      throw new NotFoundException('Export file not found');
    }

    // Authorization check for the filename: export-{userId}-{uuid}.json
    const filenameParts = filename.split('-');
    const ownerId = filenameParts[1];

    if (user.sub !== ownerId && user.role !== 'ADMIN') {
      throw new ForbiddenException('You are not authorized to download this export');
    }

    res.download(filepath, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: 'Error downloading file',
            error: err.message,
          });
        }
      }
    });
  }
}
