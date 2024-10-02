import { ColorModule } from '@modules/color/color.module';
import { SizeModule } from '@modules/size/size.module';
import { UserModule } from '@modules/user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, ProductSchema } from './models/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    forwardRef(() => ColorModule),
    forwardRef(() => SizeModule),
    forwardRef(() => UserModule),
  ],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
