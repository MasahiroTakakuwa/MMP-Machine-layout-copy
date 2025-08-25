import { LogsModule } from './../../master-logs/master-logs.module';
import { UserModule } from './../../userManagement/user/user.module';
import { AuthModule } from './../../userManagement/auth/auth.module';
import { CommonModule } from './../../userManagement/common/common.module';
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturingProduct } from './models/manufacturing-product.entity';
import { ManufacturingProductItem } from './models/manufacturing-product-item.entity';
import { ManufacturingProductController } from './manufacturing-product.controller';
import { ManufacturingProductService } from './manufacturing-product.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([ManufacturingProduct, ManufacturingProductItem]),
    CommonModule,
    AuthModule,
    UserModule,
    LogsModule,
  ],
  controllers: [ManufacturingProductController],
  providers: [ManufacturingProductService]
})
export class ManufacturingProductModule {}
