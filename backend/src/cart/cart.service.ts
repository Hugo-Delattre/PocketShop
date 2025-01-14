import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Orderline } from '../orderline/entities/orderline.entity';
import { Shop } from '../shop/entities/shop.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { AddProductDto } from './dto/add-product-dto';
import { RemoveProductDto } from './dto/remove-product-dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Orderline)
    private readonly orderlineRepository: Repository<Orderline>,
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async newOrdelineByNewProduct(
    productId: number,
    orderId: number,
    shopId: number,
  ) {
    console.log('New orderline by new product');
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    const inventory = await this.inventoryRepository.findOne({
      where: { product: product, shop: shop },
    });
    if (inventory.quantity < 1) {
      console.log('Out of stock');
      throw new Error('Out of stock');
    }
    const price = inventory.price;
    console.log('Price : ' + price);
    const orderlineData = {
      product: product,
      order: { id: orderId },
      price_at_order: price,
      quantity: 1,
    };
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    console.log('Order : ' + JSON.stringify(order));
    const orderLine = this.orderlineRepository.create(orderlineData);
    await this.orderlineRepository.save(orderLine);
    await this.orderRepository.save(order);
    console.log('Orderline created : ' + JSON.stringify(orderLine));
    await this.updateOrderTotalPrice(order, orderlineData.price_at_order);
    await this.updateStock(productId, shopId, -orderLine.quantity);
  }
  async newOrderByFirstProduct(
    productId: number,
    shopId: number,
    userId: number,
  ) {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    const inventory = await this.inventoryRepository.findOne({
      where: { product: product, shop: shop },
    });
    if (inventory.quantity < 1) {
      throw new Error('Out of stock');
    }

    const createOrderDto = {
      total_price: 0,
      creation_date: new Date(),
      is_paid: false,
      userId: userId,
    };
    this.orderRepository.create(createOrderDto);
    const order = await this.orderRepository.save(createOrderDto);

    const price = inventory.price;
    const orderlineData = {
      productId: product.id,
      orderId: order.id,
      price_at_order: price,
      quantity: 1,
    };
    const orderLine = this.orderlineRepository.create(orderlineData);
    await this.orderlineRepository.save(orderLine);
    await this.updateOrderTotalPrice(order, orderlineData.price_at_order);
    await this.updateStock(productId, shopId, -orderLine.quantity);
    return true;
  }
  async updateQuantityOrderline(
    order: Order,
    orderline: Orderline,
    productId: number,
    shopId: number,
    quantity: number,
  ) {
    console.log('Updating quantity orderline');
    console.log('Orderline before : ' + JSON.stringify(orderline));
    console.log('Quantity before : ' + orderline.quantity);
    orderline.quantity += quantity;
    console.log('Quantity after : ' + orderline.quantity);
    if (orderline.quantity < 1) {
      await this.orderlineRepository.delete(orderline.id);
      console.log('No more product');
    }
    const orderLine = await this.orderlineRepository.save(orderline);
    console.log('Orderline after ' + orderLine);
    const price = orderline.price_at_order * quantity;
    await this.updateOrderTotalPrice(order, price);
    await this.updateStock(productId, shopId, -quantity);
  }

  async updateStock(productId: number, shopId: number, quantity: number) {
    console.log('Updating stock');
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    console.log('Shop : ' + shop);
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    const inventory = await this.inventoryRepository.findOne({
      where: { product: product, shop: shop },
    });
    console.log('Inventory before : ' + inventory.quantity);
    inventory.quantity = inventory.quantity + quantity;
    const inventoryTEST = await this.inventoryRepository.save(inventory);
    console.log('Inventory before : ' + inventoryTEST.quantity);
  }
  async updateOrderTotalPrice(order: Order, price: number) {
    const newPrice = Number(order.total_price) + Number(price);
    await this.orderRepository.update(order.id, {
      total_price: newPrice,
    });
    console.log('Order total price updated');
    await this.orderRepository.save(order);
  }
  async addToCart(addProductDto: AddProductDto) {
    try {
      if (addProductDto.orderId) {
        console.log('order exists');
        const order = await this.orderRepository.findOne({
          where: { id: addProductDto.orderId },
          relations: ['orderlines'],
        });
        console.log('Order : ' + JSON.stringify(order));
        if (order.orderlines) {
          const orderline = await this.orderlineRepository.findOne({
            where: {
              order: { id: addProductDto.orderId },
              product: { id: addProductDto.productId },
            },
            relations: ['product'],
          });
          if (!orderline) {
            console.log('No orderline');
            await this.newOrdelineByNewProduct(
              addProductDto.productId,
              addProductDto.orderId,
              addProductDto.shopId,
            );
            return true;
          }
          this.updateQuantityOrderline(
            order,
            orderline,
            addProductDto.productId,
            addProductDto.shopId,
            1,
          );
          return true;
        } else {
          console.log('order doesnt have product');
          await this.newOrdelineByNewProduct(
            addProductDto.productId,
            addProductDto.orderId,
            addProductDto.shopId,
          );
          return true;
        }
      } else {
        await this.newOrderByFirstProduct(
          addProductDto.productId,
          addProductDto.shopId,
          addProductDto.userId,
        );
      }
    } catch (error) {
      throw error;
    }
    return true;
  }

  async removeFromCart(removeProductDto: RemoveProductDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: removeProductDto.orderId },
        relations: ['orderlines'],
      });
      console.log('Order : ' + JSON.stringify(order));
      if (order.orderlines) {
        const orderline = await this.orderlineRepository.findOne({
          where: {
            order: { id: removeProductDto.orderId },
            product: { id: removeProductDto.productId },
          },
          relations: ['product'],
        });
        console.log('Orderline : ' + JSON.stringify(orderline));
        if (orderline) {
          this.updateQuantityOrderline(
            order,
            orderline,
            removeProductDto.productId,
            removeProductDto.shopId,
            -1,
          );
          return true;
        } else {
          throw new Error('No orderline, cant remove from cart');
        }
      }
    } catch (error) {
      throw error;
    }
    return true;
  }
}
