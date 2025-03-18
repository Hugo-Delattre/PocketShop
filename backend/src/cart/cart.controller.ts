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
  getCart(@Param('userId') userId: number) {
    return this.cartService.getCart(userId);
  }
}
