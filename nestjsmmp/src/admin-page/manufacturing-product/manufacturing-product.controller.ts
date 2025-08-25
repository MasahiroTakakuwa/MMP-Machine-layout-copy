import { HasPermission } from './../../userManagement/permission/has-permission.decorator';
import { AuthGuard } from './../../userManagement/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ManufacturingProductService } from './manufacturing-product.service';
import { Body, Controller, Post, Req, UnsupportedMediaTypeException, UseInterceptors, Get, Param, Res, Patch, UploadedFile, Delete, UseGuards } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as mimeTypes from 'mime-types';
import { Request, Response } from 'express';
import { MvpProductsOverallXYListDto } from './models/mvp-products-overall-xy.dto';
import { ManufacturingMethod } from './models/manufacturing-method.dto';
import { AddResponseCapacityItem } from './models/add-response-capacity.dto';
import { EditResponseCapacityItemContentDto } from './models/edit-response-capacity.dto';
import { AddMMaterialItemDtoList } from './models/material-item.dto';
import { AddTreatmentItemDtoList } from './models/treatment-item.dto';
import { ResearchDevelopmentDto } from './models/research-development.dto';
import { EditResearchDevelopmentItemDto } from './models/edit-research-development.dto';
import { MvpProductsOverallDto } from './models/mvp-products-overall.dto';
import { MvpProductsOverallContentDto } from './models/mvp-products-overall-content.dto';
import { ManufacturingMethodItemContentDto } from './models/manufacturing-method-item-content.dto';
import { EditResponseCapacityItemImgDto } from './models/edit-response-capacity-item-img.dto';
import { DelResponseCapacityItemContentDto } from './models/del-response-capacity.dto';
import { EditResearchDevelopmentItemContentDto } from './models/edit-research-development-content.dto';
import { DelResearchDevelopmentContentDto } from './models/del-research-development-content.dto';


@Controller('manufacturing-product')
export class ManufacturingProductController {
    constructor(
        private manufacturingProductService: ManufacturingProductService
    ){}
    
    
    //Cập nhật hình product overall
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('mvp-products-overall-img')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/manufacturing-product',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = mimeTypes.lookup(img.originalname);
            if (allowedMimeTypes.includes(fileType)) {
              callback(null, true); // Chấp nhận tệp
            } else {
              callback(new UnsupportedMediaTypeException('ONLY IMAGE FILES UNDER 5MB ARE ACCEPTED'), false); // Từ chối tệp
            }
        },
    }))
    async updateBackgroundProductOverall(
        @UploadedFile() img, 
        @Body() body: MvpProductsOverallDto,
        @Req() request: Request,
    ): Promise<any>{
        return await this.manufacturingProductService.updateBackgroundProductOverall(img, body, request);
    }

    //Cập nhật nội dung quảng cáo product overall
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('mvp-products-overall-content')
    async updateContentProductOverall(
        @UploadedFile() img, 
        @Body() body: MvpProductsOverallContentDto,
        @Req() request: Request,
    ): Promise<any>{
        return await this.manufacturingProductService.updateContentProductOverall(body, request);
    }

    //Lấy thông tin hình ảnh
    @Get('uploads/manufacturing-product/:path')
    async getImage(
        @Param('path') path,
        @Res() res: Response
    ) {
        res.sendFile(path, {root: 'uploads/manufacturing-product'})
    }

    //Lấy thông tin page
    @Get(':page')
    async getInfo(
        @Param('page') page: number,
    ) {
        return await this.manufacturingProductService.getInfoPage(Number(page));
    }

    //Cập nhật lại tọa độ của các item của Branch Overview (2 hình EN và JP)
    //Cập nhật tọa độ hình ảnh EN -> language: en
    //Cập nhật tọa độ hình ảnh JP -> language: jp
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('mvp-products-overall-coordinates')
    async mvpProductsOverallCoordinates(
        @Body() body: MvpProductsOverallXYListDto
    ): Promise<any>{
        return await this.manufacturingProductService.mvpProductsOverallCoordinates(body);
    }


    //Cập nhật hình ảnh manufacturing-method
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('manufacturing-method-item')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/manufacturing-product',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = mimeTypes.lookup(img.originalname);
            if (allowedMimeTypes.includes(fileType)) {
              callback(null, true); // Chấp nhận tệp
            } else {
              callback(new UnsupportedMediaTypeException('ONLY IMAGE FILES UNDER 5MB ARE ACCEPTED'), false); // Từ chối tệp
            }
        },
    }))
    async changeManufacturingMethodItem(
        @Body() body: ManufacturingMethod,
        @UploadedFile() img
    ): Promise<any>{
        return await this.manufacturingProductService.changeManufacturingMethodItem(img, body);
    }

    //Cập nhật nội dung quảng cáo manufacturing-method
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('manufacturing-method-item-content')
    async manufacturingMethodItemContent(
        @UploadedFile() img, 
        @Body() body: ManufacturingMethodItemContentDto,
        @Req() request: Request,
    ): Promise<any>{
        return await this.manufacturingProductService.manufacturingMethodItemContent(body, request);
    }

    //Thêm thông tin sản phẩm
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Post('add-response-capacity-item')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/manufacturing-product',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = mimeTypes.lookup(img.originalname);
            if (allowedMimeTypes.includes(fileType)) {
              callback(null, true); // Chấp nhận tệp
            } else {
              callback(new UnsupportedMediaTypeException('ONLY IMAGE FILES UNDER 5MB ARE ACCEPTED'), false); // Từ chối tệp
            }
        },
    }))
    async addResponseCapacityItem(
        @Body() body: AddResponseCapacityItem,
        @UploadedFile() img
    ): Promise<any>{
        return await this.manufacturingProductService.addResponseCapacityItem(img, body);
    }

    //Cập nhật hình ảnh sản phẩm
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('edit-response-capacity-item')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/manufacturing-product',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = mimeTypes.lookup(img.originalname);
            if (allowedMimeTypes.includes(fileType)) {
              callback(null, true); // Chấp nhận tệp
            } else {
              callback(new UnsupportedMediaTypeException('ONLY IMAGE FILES UNDER 5MB ARE ACCEPTED'), false); // Từ chối tệp
            }
        },
    }))
    async editResponseCapacityItem(
        @UploadedFile() img,
        @Body() body: EditResponseCapacityItemImgDto,
    ): Promise<any>{
        return await this.manufacturingProductService.editResponseCapacityItem(img, body);
    }

    //Cập nhật thông tin sản phẩm
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('edit-response-capacity-item-content')
    async editResponseCapacityItemContent(
        @Body() body: EditResponseCapacityItemContentDto,
    ): Promise<any>{
        return await this.manufacturingProductService.editResponseCapacityItemContent(body);
    }

    //Xóa thông tin sản phẩm
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Delete('del-response-capacity-item')
    async delResponseCapacityItem(
        @Body() body: DelResponseCapacityItemContentDto,
    ): Promise<any>{
        return await this.manufacturingProductService.delResponseCapacityItem(body);
    }

    //Cập nhật thông tin material
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('material-item')
    async materialItem(
        @Body() body: AddMMaterialItemDtoList
    ): Promise<any>{
        return await this.manufacturingProductService.materialItem(body);
    }

    //Cập nhật thông tin treatment
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('treatment-item')
    async treatmentItem(
        @Body() body: AddTreatmentItemDtoList
    ): Promise<any>{
        return await this.manufacturingProductService.treatmentItem(body);
    }

    //Cập nhật thông tin research-development
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('research-development')
    async researchDevelopment(
        @Body() body: ResearchDevelopmentDto
    ): Promise<any>{
        return await this.manufacturingProductService.researchDevelopment(body);
    }

    //Add thông tin research-development
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Post('add-research-development')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/manufacturing-product',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = mimeTypes.lookup(img.originalname);
            if (allowedMimeTypes.includes(fileType)) {
              callback(null, true); // Chấp nhận tệp
            } else {
              callback(new UnsupportedMediaTypeException('ONLY IMAGE FILES UNDER 5MB ARE ACCEPTED'), false); // Từ chối tệp
            }
        },
    }))
    async addResearchDevelopment(
        @UploadedFile() img,
        @Body() body: any
    ): Promise<any>{
        return await this.manufacturingProductService.addResearchDevelopment(img, JSON.parse(body.body));
    }

    //Chỉnh sửa thông tin hình ảnh research-development
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('edit-research-development')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/manufacturing-product',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = mimeTypes.lookup(img.originalname);
            if (allowedMimeTypes.includes(fileType)) {
              callback(null, true); // Chấp nhận tệp
            } else {
              callback(new UnsupportedMediaTypeException('ONLY IMAGE FILES UNDER 5MB ARE ACCEPTED'), false); // Từ chối tệp
            }
        },
    }))
    async editResearchDevelopment(
        @UploadedFile() img,
        @Body() body: EditResearchDevelopmentItemDto
    ): Promise<any>{
        return await this.manufacturingProductService.editResearchDevelopment(img, body);
    }

    //Chỉnh sửa thông tin research-development
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Patch('edit-research-development-content')
    async editResearchDevelopmentContent(
        @Body() body: EditResearchDevelopmentItemContentDto
    ): Promise<any>{
        return await this.manufacturingProductService.editResearchDevelopmentContent(body);
    }

    //Xóa thông tin sản phẩm
    @UseGuards(AuthGuard)
    @HasPermission(14)
    @Delete('del-research-development-content')
    async delResearchDevelopmentContent(
        @Body() body: DelResearchDevelopmentContentDto,
    ): Promise<any>{
        return await this.manufacturingProductService.delResearchDevelopmentContent(body);
    }

}
