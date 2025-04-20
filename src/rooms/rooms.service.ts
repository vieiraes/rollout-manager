import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Room } from '@prisma/client';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({
      data: createRoomDto,
    });
  }

  async findAll(): Promise<Room[]> {
    return this.prisma.room.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    try {
      return await this.prisma.room.update({
        where: { id },
        data: updateRoomDto,
      });
    } catch (error) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<Room> {
    try {
      return await this.prisma.room.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}