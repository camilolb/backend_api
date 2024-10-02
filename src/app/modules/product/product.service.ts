import { Types } from 'mongoose';
import slugify from 'slugify';

import { ColorService } from '@modules/color/color.service';
import { SizeService } from '@modules/size/size.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessagesMapping } from '@shared/messages-mapping';
import { BaseService } from '@shared/services/base.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductRepository } from './repositories/product.repository';
import { ProductDocument } from './models/product.entity';

@Injectable()
export class ProductService extends BaseService<
  ProductDocument,
  ProductRepository
> {
  constructor(
    protected readonly repository: ProductRepository,
    protected readonly sizeService: SizeService,
    protected readonly colorService: ColorService,
  ) {
    super();
  }

  async create(
    createProductDto: Partial<CreateProductDto>,
  ): Promise<ProductDocument> {
    const data = {
      ...createProductDto,
      slug: slugify(createProductDto.name, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      }),
    };
    return this.repository.create(data);
  }

  async updateById(
    id: string | Types.ObjectId,
    data: UpdateProductDto,
  ): Promise<ProductDocument> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    if (data.details) {
      Object.keys(data.details).forEach((key) => {
        if (data.details[key] === '') {
          delete data.details[key];
        } else {
          item.details[key] = data.details[key];
        }
      });

      data.details = item.details;
    }

    return this.repository.updateById(id, data);
  }

  async findById(id: string | Types.ObjectId, user?: any): Promise<any> {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new HttpException(MessagesMapping['#14'], HttpStatus.NOT_FOUND);
    }

    return product;
  }
}
