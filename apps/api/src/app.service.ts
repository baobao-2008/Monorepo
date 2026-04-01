import { Injectable } from '@nestjs/common';

// @ts-ignore
import { prisma } from '@vibe/db';

@Injectable()
export class AppService {
  async getHello() {
    // Gọi DB lấy dữ liệu
    const allProducts = await prisma.product.findMany();

    return {
      message: 'Chào mừng đến với hệ thống',
      totalItems: allProducts.length,
      data: allProducts,
    };
  }
}
