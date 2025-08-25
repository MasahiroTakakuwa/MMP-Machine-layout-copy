import { HasPermission } from './../../userManagement/permission/has-permission.decorator';
import { AuthGuard } from './../../userManagement/auth/auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UnsupportedMediaTypeException, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { QualityService } from './quality.service';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as mimeTypes from 'mime-types';
import { Request } from 'express';


@ApiTags('Quality Page')
@Controller('quality')
export class QualityController {
    constructor(private qualityPageService: QualityService) { }

    @Get('get-content')
    async get_content() {
        return this.qualityPageService.get_content()
    }

    @ApiParam({ name: 'path', type: String })
    @Get('get-image/:path')
    async getFile(@Param('path') path, @Res() res: Response) {
        res.sendFile(path, { root: 'uploads/quality' })
    }

    @UseGuards(AuthGuard)
    @HasPermission(22)
    @Post('upload')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/quality',
            filename(_, file, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (_, file, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/PNG',
                'image/JPEG',
                'image/JPG'
            ];
            const fileType = mimeTypes.lookup(file.originalname);
            if (allowedMimeTypes.includes(fileType)) {
                callback(null, true); // Chấp nhận tệp
            } else {
                callback(new UnsupportedMediaTypeException('ONLY FILES *.png, *.jpeg, *.jpg, *.PNG, *.JPEG, *.JPG ARE ACCEPTED'), false) // Từ chối tệp
            }
        },
    }))
    async uploadQuality(@UploadedFiles() file, @Body() body, @Req() request: Request) {
        // console.log(file, body)
        return this.qualityPageService.upload_quality(file, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(22)
    @Put('edit/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/quality',
            filename(_, file, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (_, file, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/PNG',
                'image/JPEG',
                'image/JPG'
            ];
            const fileType = mimeTypes.lookup(file.originalname);
            if (allowedMimeTypes.includes(fileType)) {
                callback(null, true); // Chấp nhận tệp
            } else {
                callback(new UnsupportedMediaTypeException('ONLY FILES *.png, *.jpeg, *.jpg, *.PNG, *.JPEG, *.JPG ARE ACCEPTED'), false) // Từ chối tệp
            }
        },
    }))
    async editQuality(@UploadedFiles() file, @Param('id') id: number, @Body() body, @Req() request: Request) {
        // console.log(file, id)
        return this.qualityPageService.edit_quality(file, id, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(22)
    @ApiParam({ name: 'id', type: Number })
    @Delete('delete/:id')
    async deleteBanner(@Param('id') id: number, @Req() request: Request) {
        return this.qualityPageService.delete_quality(id, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(22)
    @Post('upload/equipment')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/quality',
            filename(_, file, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (_, file, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/PNG',
                'image/JPEG',
                'image/JPG'
            ];
            const fileType = mimeTypes.lookup(file.originalname);
            if (allowedMimeTypes.includes(fileType)) {
                callback(null, true); // Chấp nhận tệp
            } else {
                callback(new UnsupportedMediaTypeException('ONLY FILES *.png, *.jpeg, *.jpg, *.PNG, *.JPEG, *.JPG ARE ACCEPTED'), false) // Từ chối tệp
            }
        },
    }))
    async uploadQualityEquipment(@UploadedFiles() file, @Body() body, @Req() request: Request) {
        // console.log(file, body)
        return this.qualityPageService.upload_quality_equipment(file, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(22)
    @Put('edit/equipment/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/quality',
            filename(_, file, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (_, file, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/PNG',
                'image/JPEG',
                'image/JPG'
            ];
            const fileType = mimeTypes.lookup(file.originalname);
            if (allowedMimeTypes.includes(fileType)) {
                callback(null, true); // Chấp nhận tệp
            } else {
                callback(new UnsupportedMediaTypeException('ONLY FILES *.png, *.jpeg, *.jpg, *.PNG, *.JPEG, *.JPG ARE ACCEPTED'), false) // Từ chối tệp
            }
        },
    }))
    async editQualityEquipment(@UploadedFiles() file, @Param('id') id: number, @Body() body, @Req() request: Request) {
        // console.log(file, id)
        return this.qualityPageService.edit_quality_equipment(file, id, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(22)
    @ApiParam({ name: 'id', type: Number })
    @Delete('delete/equipment/:id')
    async deleteEquipment(@Param('id') id: number, @Req() request: Request) {
        return this.qualityPageService.delete_equipment(id, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(22)
    @Put('edit/comment/:id')
    async editQualityComment(@Param('id') id: number, @Body() body, @Req() request: Request) {
        return this.qualityPageService.update_comment(id, body, request)
    }
}
