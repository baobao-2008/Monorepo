import { Injectable } from '@nestjs/common';
// @ts-ignore
import { prisma } from '@vibe/db';

@Injectable()
export class OrdersService {
  async create(data: any) {
    return await prisma.order.create({
      data: data,
    });
  }

  async findAll() {
    return await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
