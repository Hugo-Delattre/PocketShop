import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, JsonContains, Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { Orderline } from '../orderline/entities/orderline.entity';
import { Shop } from '../shop/entities/shop.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { AddProductDto } from './dto/add-product-dto';
import { RemoveProductDto } from './dto/remove-product-dto';
import { CartResponseDao } from './dao/cart-response';
import { User } from '../user/entities/user.entity';
import { ProductService } from '../product/product.service';
import { ProductInShop } from '../product/dto/product-info.dto';
import { CreateOrderlineDto } from '../orderline/dto/create-orderline.dto';
import { KpiService } from '../kpi/kpi.service';
import { BillingDetail } from 'src/billing-details/entities/billing-detail.entity';
import { ShortCartResponseDao } from './dao/short-cart-info';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly productService: ProductService,
    @Inject(forwardRef(() => KpiService))
    private readonly kpiService: KpiService,
    @InjectRepository(BillingDetail)
    private readonly billingRepository: Repository<BillingDetail>,
  ) {}

  async newOrdelineByNewProduct(
    productId: string,
    orderId: number,
    shopId: number,
  ) {
    console.log('New orderline by new product');
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    const product = await this.productRepository.findOne({
      where: { open_food_fact_id: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    if (!shop) {
      throw new Error('Shop not found');
    }
    const inventory = await this.inventoryRepository.findOne({
      where: { product: product, shop: shop },
    });
    if (!inventory || inventory.quantity < 1) {
      console.log('Out of stock');
      throw new Error('Out of stock');
    }
    const price = inventory.price;
    console.log('Price : ' + price);
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new Error('Order not found');
    }
    const orderlineData: CreateOrderlineDto = {
      price_at_order: price,
      quantity: 1,
    };
    console.log('Order 1: ' + JSON.stringify(order));
    const orderLine = this.orderlineRepository.create(orderlineData);
    orderLine.product = product;
    orderLine.order = order;
    await this.orderlineRepository.save(orderLine);
    console.log('tata: ' + JSON.stringify(order));
    order.user = await this.userRepository.findOne({
      where: { id: order.user.id },
    });
    await this.orderRepository.save(order);
    console.log(
      'Orderline created : ' +
        JSON.stringify(orderLine) +
        ' ' +
        JSON.stringify(orderlineData),
    );
    await this.updateOrderTotalPrice(order, orderlineData.price_at_order);
    await this.updateStock(productId, shopId, -orderLine.quantity);
  }
  async newOrderByFirstProduct(
    productId: string,
    shopId: number,
    userId: number,
  ) {
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    const product = await this.productRepository.findOne({
      where: { open_food_fact_id: productId },
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
    };
    console.log('Creating order' + JSON.stringify(createOrderDto));
    const order = await this.orderRepository.create(createOrderDto);
    order.user = await this.userRepository.findOne({
      where: { id: userId },
    });
    order.billing = await this.billingRepository.findOne({
      where: { id: 1 },
    });
    await this.orderRepository.save(order);
    console.log('order created' + JSON.stringify(order));
    const price = inventory.price;
    const orderlineData = {
      price_at_order: price,
      quantity: 1,
    };
    const orderLine = this.orderlineRepository.create(orderlineData);
    orderLine.product = product;
    orderLine.order = order;
    await this.orderlineRepository.save(orderLine);
    await this.updateOrderTotalPrice(order, orderlineData.price_at_order);
    await this.updateStock(productId, shopId, -orderLine.quantity);
    return true;
  }
  async updateQuantityOrderline(
    order: Order,
    orderline: Orderline,
    productId: string,
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
    console.log('Orderline after ' + JSON.stringify(orderLine));
    const price = orderline.price_at_order * quantity;
    await this.updateOrderTotalPrice(order, price);
    await this.updateStock(productId, shopId, -quantity);
  }

  async updateStock(productId: string, shopId: number, quantity: number) {
    console.log('Updating stock');
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    console.log('Shop : ' + shop);
    const product = await this.productRepository.findOne({
      where: { open_food_fact_id: productId },
    });

    const inventory = await this.inventoryRepository.findOne({
      where: { product: product, shop: shop },
    });
    console.log('Inventory before : ' + inventory.quantity);
    inventory.quantity = inventory.quantity + quantity;
    await this.inventoryRepository.save(inventory);
    if (inventory.quantity === 0) {
      console.log('Out of stock');
      this.kpiService.incrementOutOfStockCount(product, new Date());
    }
  }
  async updateOrderTotalPrice(order: Order, price: number) {
    const newPrice = Number(order.total_price) + Number(price);
    console.log('old price: ' + order.total_price);
    console.log('adding : ' + price);
    console.log('New price : ' + newPrice);
    await this.orderRepository.update(order.id, {
      total_price: newPrice,
    });
    console.log('Order total price updated');
    const orderEntity = await this.orderRepository.findOne({
      where: { id: order.id },
    });
    console.log('Order entity : ' + JSON.stringify(orderEntity));
    await this.orderRepository.save(orderEntity);
  }
  async addToCart(addProductDto: AddProductDto) {
    try {
      const product = await this.productRepository.findOne({
        where: { open_food_fact_id: addProductDto.productId },
      });
      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
      const order = await this.orderRepository.findOne({
        where: { user: { id: addProductDto.userId }, is_paid: false },
        relations: ['orderlines'],
      });
      console.log('User ' + JSON.stringify(addProductDto.userId));
      if (!order) {
        console.log('order doesnt exist');
        await this.newOrderByFirstProduct(
          product.open_food_fact_id,
          addProductDto.shopId,
          addProductDto.userId,
        );
      } else {
        console.log('order exists');
        console.log('Order 2: ' + JSON.stringify(order));
        if (order!.orderlines) {
          console.log('Orderlines : ' + JSON.stringify(order!.orderlines));
          console.log('Orderline : ' + JSON.stringify(order!.orderlines));
          const orderline = await this.orderlineRepository.findOne({
            where: {
              order: { id: order.id },
              product: { open_food_fact_id: product.open_food_fact_id },
            },
          });
          if (!orderline) {
            console.log('No orderline');
            await this.newOrdelineByNewProduct(
              product.open_food_fact_id,
              order.id,
              addProductDto.shopId,
            );
            return {
              statusCode: 201,
              data: await this.getCartInfos(addProductDto.userId),
            };
          }
          this.updateQuantityOrderline(
            order,
            orderline,
            product.open_food_fact_id,
            addProductDto.shopId,
            1,
          );
          return {
            statusCode: 200,
            data: await this.getCartInfos(addProductDto.userId),
          };
        } else {
          console.log('order doesnt have product');
          await this.newOrdelineByNewProduct(
            product.open_food_fact_id,
            addProductDto.orderId,
            addProductDto.shopId,
          );
          return {
            statusCode: 200,
            data: await this.getCartInfos(addProductDto.userId),
          };
        }
      }
    } catch (error) {
      throw error;
    }
    console.log('Returning cart');
    return this.getCart(addProductDto.userId);
  }

  async removeFromCart(removeProductDto: RemoveProductDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: removeProductDto.orderId },
        relations: ['orderlines'],
      });
      console.log('Order 3: ' + JSON.stringify(order));
      if (order.orderlines) {
        const orderline = await this.orderlineRepository.findOne({
          where: {
            order: { id: removeProductDto.orderId },
            product: { open_food_fact_id: removeProductDto.productId },
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

  async getCart(userId: number): Promise<CartResponseDao> {
    const cart = new CartResponseDao();
    cart.products = [];
    const order = await this.orderRepository.findOne({
      relations: ['orderlines'],
      where: { user: { id: userId }, is_paid: false },
    });

    if (!order) {
      return null;
    }
    console.log('Order 4: ' + JSON.stringify(order));
    cart.userId = Number(userId);
    cart.orderId = order.id;
    const orderlines = await this.orderlineRepository.find({
      where: { order: order },
      relations: ['product'],
    });
    for (const orderline of orderlines) {
      console.log('Orderline : ' + JSON.stringify(orderline));
      const productInfos = await this.getInfoProduct(
        orderline.product.open_food_fact_id,
      );
      const productStorageInfos = {
        selectedQuantity: orderline.quantity,
        priceAtOrder: orderline.price_at_order,
      };

      cart.products.push({ ...productInfos, ...productStorageInfos });
    }
    return cart;
  }

  async getCartInfos(userId: number): Promise<ShortCartResponseDao> {
    const cart = await this.getCart(userId);
    const returnedCart = new ShortCartResponseDao();
    returnedCart.products = cart.products.map((product) => {
      return {
        price: product.price,
        name: product.product_name_fr,
        availableQuantity: Number(product.availableQuantity),
      };
    });
    console.log('Returned cart : ' + JSON.stringify(returnedCart));
    return returnedCart;
  }
  async getInfoProduct(productId: string): Promise<ProductInShop> {
    return await this.productService.findOne(productId);
  }

  async getAverageCartPrice(date: Date): Promise<number> {
    const orders = await this.orderRepository.find({
      where: {
        is_paid: true,
        creation_date: Between(
          new Date(date.setHours(0, 0, 0, 0)),
          new Date(date.setHours(23, 59, 59, 999)),
        ),
      },
    });

    let totalPrice = 0;
    let totalOrders = 0;
    for (const order of orders) {
      totalPrice += Number(order.total_price);
      totalOrders++;
    }
    return Number((totalPrice / totalOrders).toFixed(2));
  }
}
