import { Injectable } from '@nestjs/common';
// @ts-ignore
import { prisma } from '@vibe/db';

@Injectable()
export class ProductsService {
  // 1. Hàm lấy toàn bộ danh sách sản phẩm
  async findAll() {
    try {
      const allProducts = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc', // Món nào mới nhập sẽ hiện lên đầu
        },
      });
      return allProducts;
    } catch (error) {
      return { message: 'Lỗi khi lấy danh sách sản phẩm', error };
    }
  }

  // 2. Hàm lấy chi tiết 1 sản phẩm theo ID
  async findOne(id: number) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: id },
      });

      if (!product) {
        return { message: 'Không tìm thấy sản phẩm này' };
      }

      return product;
    } catch (error) {
      return { message: 'Lỗi khi tìm sản phẩm', error };
    }
  }

  // 3. Hàm tạo sản phẩm (Dùng nếu bạn muốn tạo từ API thay vì Prisma Studio)
  async create(data: any) {
    return await prisma.product.create({
      data: data,
    });
  }
}
