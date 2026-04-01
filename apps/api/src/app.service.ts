import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // <-- Đừng quên export nha!
  getHello() {
    return { message: 'Vibe App API is running!' };
  }
}
