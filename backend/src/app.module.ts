import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.gard';
import { ProductModule } from './product/product.module';
import { ShopModule } from './shop/shop.module';
import { OrderModule } from './order/order.module';
import { OrderlineModule } from './orderline/orderline.module';
import { InventoryModule } from './inventory/inventory.module';
import { BillingDetailsModule } from './billing-details/billing-details.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Charge les variables d'env

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Charge ConfigModule
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: false, // Mets `true` en dev uniquement
      }),
      inject: [ConfigService], // Injecte ConfigService
    }),

    UserModule,
    AuthModule,
    ProductModule,
    ShopModule,
    InventoryModule,
    OrderModule,
    OrderlineModule,
    CartModule,
    BillingDetailsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}