import { Controller, Body, Patch, Get, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddProductDto } from './dto/add-product-dto';
import { RemoveProductDto } from './dto/remove-product-dto';
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Patch('/add')
  addToCart(@Body() addProductDto: AddProductDto) {
    console.log(addProductDto);
    return this.cartService.addToCart(addProductDto);
  }

  @Patch('/remove')
  removeFromCart(@Body() removeProductDto: RemoveProductDto) {
    return this.cartService.removeFromCart(removeProductDto);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: number) {
    const cart = await this.cartService.getCart(userId);
    if (cart === null) {
      return { message: 'Cart is empty', products: [] };
    }
    return cart;
  }
}
