import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post() // Khi khách bấm "Xác nhận đặt hàng", web sẽ gửi lệnh POST vào đây
  create(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Get() // Để bạn kiểm tra danh sách đơn hàng: localhost:3000/orders
  findAll() {
    return this.ordersService.findAll();
  }
}
