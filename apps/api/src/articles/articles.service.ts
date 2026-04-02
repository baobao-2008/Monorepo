import { Injectable } from '@nestjs/common';
// @ts-ignore
import { prisma } from '@vibe/db';

@Injectable()
export class ArticlesService {
  async findAll() {
    return await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
