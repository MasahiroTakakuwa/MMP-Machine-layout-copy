import { HasPermission } from './../../userManagement/permission/has-permission.decorator';
import { AuthGuard } from './../../userManagement/auth/auth.guard';
import { Response } from 'express';
import { Controller, Param, Res, Get, Post, UseInterceptors, UnsupportedMediaTypeException, Body, UploadedFiles, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { HomeService } from './home.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as mimeTypes from 'mime-types';
import { Request } from 'express';

@ApiTags('HomePage')
@Controller('home')
export class HomeController {
    constructor(private homePageService: HomeService) { }

    @Get('get-content')
    async get_content() {
        return this.homePageService.get_content()
    }

    @ApiParam({ name: 'path', type: String })
    @Get('get-image/:path')
    async getFile(@Param('path') path, @Res() res: Response) {
        res.sendFile(path, { root: 'uploads/homepage' })
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @Put('upload/logo/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async uploadLogo(@UploadedFiles() file, @Param('id') id, @Req() request: Request) {
        // console.log(file,id)
        return this.homePageService.upload_logo(file, id, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiBody({
        type: Object, examples: {
            body: {
                value: {
                    id: null,
                }
            }
        }
    })
    @Post('upload/banner')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async uploadBanner(@UploadedFiles() file, @Body() body, @Req() request: Request) {
        // console.log(file,body)
        return this.homePageService.upload_banner(file, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        description: '0 là không thay đổi, 1 là có thay đổi',
        type: Object, examples: {
            body: {
                value: {
                    img_en: '0',
                    img_jp: '1',
                }
            }
        }
    })
    @Put('edit/banner/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async editBanner(@UploadedFiles() file, @Param('id') id: number, @Body() body, @Req() request: Request) {
        // console.log(file, id)
        return this.homePageService.edit_banner(file, id, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @Delete('delete/banner/:id')
    async deleteBanner(@Param('id') id: number, @Req() request: Request) {
        return this.homePageService.delete_banner(id, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        type: Object, examples: {
            body: {
                value: {
                    content_en: 'abc',
                    content_jp: 'xyz',
                }
            }
        }
    })
    @Put('edit/short-disciption/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async editShortDisciption(@UploadedFiles() file, @Param('id') id: number, @Body() body, @Req() request: Request) {
        // console.log(file, id)
        return this.homePageService.edit_short_discription(file, id, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        description: '0 là không thay đổi, 1 là có thay đổi',
        type: Object, examples: {
            body: {
                value: {
                    img_en: '0',
                    img_jp: '1',
                    content_en: 'abc',
                    content_jp: 'xyz'
                }
            }
        }
    })
    @Put('edit/story/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async editStory(@UploadedFiles() file, @Param('id') id: number, @Body() body, @Req() request: Request) {
        // console.log(file, id, body)
        return this.homePageService.edit_story(file, id, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        description: '0 là không thay đổi, 1 là có thay đổi',
        type: Object, examples: {
            body: {
                value: {
                    img_icon: '0',
                    img_bg: '1',
                    content_en: 'abc',
                    content_jp: 'xyz'
                }
            }
        }
    })
    @Put('edit/menu/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async editMenu(@UploadedFiles() file, @Param('id') id: number, @Body() body, @Req() request: Request) {
        // console.log(file, id)
        return this.homePageService.edit_menu(file, id, body, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @Post('upload/client')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async uploadFooter(@UploadedFiles() file, @Req() request: Request) {
        // console.log(file,id)
        return this.homePageService.upload_footer(file, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @Put('edit/client/:id')
    @UseInterceptors(FilesInterceptor('file', 20, {
        storage: diskStorage({
            destination: './uploads/homepage',
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
    async editFooter(@UploadedFiles() file, @Param('id') id, @Req() request: Request) {
        // console.log(file,id)
        return this.homePageService.edit_footer(file, id, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @Delete('delete/client/:id')
    async deleteFooter(@Param('id') id: number, @Req() request: Request) {
        return this.homePageService.delete_footer(id, request)
    }

    @UseGuards(AuthGuard)
    @HasPermission(10)
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        type: Object, examples: {
            body: {
                value: {
                    content_en: 'abc',
                    content_jp: 'xyz'
                }
            }
        }
    })
    @Put('edit/comment-client/:id')
    async editQualityComment(@Param('id') id: number, @Body() body, @Req() request: Request) {
        return this.homePageService.edit_comment_footer(id, body, request)
    }

}