import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, NoteResponseDto } from './dto';
import { NoteTargetType } from './enums';
import { Protected } from '@/common/decorators/protected.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService
  ) {}

  @Post()
  @Protected()
  @ApiOperation({ summary: 'Создать заметку' })
  @ApiResponse({
    status: 201,
    description: 'Заметка создана',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные или заметка уже существует' })
  @ApiResponse({ status: 404, description: 'Цель не найдена' })
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateNoteDto,
  ): Promise<NoteResponseDto> {
    return await this.notesService.create(user.id, dto);
  }

  @Patch(':id')
  @Protected()
  @ApiOperation({ summary: 'Обновить существующую заметку' })
  @ApiResponse({
    status: 200,
    description: 'Заметка обновлена',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заметка не найдена' })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) noteId: string,
    @Body() dto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    return await this.notesService.update(user.id, noteId, dto);
  }

  @Delete(':id')
  @Protected()
  @ApiOperation({ summary: 'Удалить заметку' })
  @ApiResponse({ status: 200, description: 'Заметка удалена' })
  @ApiResponse({ status: 404, description: 'Заметка не найдена' })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) noteId: string,
  ): Promise<{ success: boolean }> {
    await this.notesService.delete(user.id, noteId);
    return { success: true };
  }

  @Get(':targetType/:targetId')
  @Protected()
  @ApiOperation({ summary: 'Получить заметку по типу и ID цели' })
  @ApiResponse({
    status: 200,
    description: 'Заметка найдена',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Заметка не найдена' })
  async get(
    @CurrentUser() user: JwtPayload,
    @Param('targetType') targetType: NoteTargetType,
    @Param('targetId', ParseUUIDPipe) targetId: string,
  ): Promise<NoteResponseDto> {
    return await this.notesService.get(user.id, targetType, targetId);
  }
}
