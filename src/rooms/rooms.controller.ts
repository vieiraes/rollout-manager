import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from '@prisma/client';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Room> {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto): Promise<Room> {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Room> {
    return this.roomsService.remove(+id);
  }
}