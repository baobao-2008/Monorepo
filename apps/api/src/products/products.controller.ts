import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Cổng GET: localhost:3000/products
  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  // Cổng GET kèm ID: localhost:3000/products/1
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Dấu + phía trước id để ép kiểu từ chuỗi "1" sang số 1 cho đúng kiểu dữ liệu của DB
    return await this.productsService.findOne(+id);
  }

  // Cổng POST: Để gửi dữ liệu mới lên
  @Post()
  async create(@Body() createProductDto: any) {
    return await this.productsService.create(createProductDto);
  }
}
