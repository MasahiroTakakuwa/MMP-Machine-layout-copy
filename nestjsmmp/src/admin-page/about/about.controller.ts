import { AuthGuard } from './../../userManagement/auth/auth.guard';
import { HasPermission } from './../../userManagement/permission/has-permission.decorator';
import { Response } from 'express';
import { AboutService } from './about.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UnsupportedMediaTypeException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UpdateCompanyInformation } from './models/about-company-information.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as mimeTypes from 'mime-types';
import { UpdateCompanySpiritLetter } from './models/about-spirit.dto';
import { UpdateCompanyManufacturingMachineList } from './models/about-company-manufacturing-machine-list.dto';
import { EnterIso } from './models/iso.dto';
import { BranchOverviewListDto } from './models/branch-overview.dto';
import { AddBranchOverview } from './models/add-branch-overview.dto';
import { EditBranchOverview } from './models/edit-branch-overview.dto';
import { Request } from 'express';

@Controller('about')
export class AboutController {
    constructor(
        private aboutService: AboutService
    ){}

    @Get('uploads/about/:path')
    async getImage(
        @Param('path') path,
        @Res() res: Response
    ) {
        res.sendFile(path, {root: 'uploads/about'})
    }

    //Lấy thông tin trang about
    @Get('')
    async getInfo() {
        return await this.aboutService.getInfoPage();
    }

    //Sửa thông tin nội dung company-information bao gồm hình ảnh (1 hình) và nội dung đính kèm
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('company-information')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/about',
            filename(_, file, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (_, file, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = mimeTypes.lookup(file.originalname);
            if (allowedMimeTypes.includes(fileType)) {
              callback(null, true); // Chấp nhận tệp
            } else {
              callback(new UnsupportedMediaTypeException('ONLY IMAGE FILES UNDER 3MB ARE ACCEPTED'), false); // Từ chối tệp
            }
        },
    }))
    async editCompanyInformation(
        @UploadedFile() img,
        @Body() body: UpdateCompanyInformation, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.editCompanyInformation(img, body, request);
    }

    //Cập nhật lại hình ảnh của spirit(2 hình EN và JP)
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('company-spirit')
    @UseInterceptors(FilesInterceptor('imgs', 2, {
        storage: diskStorage({
            destination: './uploads/about',
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
    async editCompanySpirit(
        @UploadedFiles() imgs, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.editCompanySpirit(imgs, request);
    }

    //Sửa thông tin nội dung company-spitrit bao gồm 2 hình ảnh theo thứ tự ông tổng và hình ảnh chữ ký(2 hình) và nội dung đính kèm
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('company-spirit-letter')
    @UseInterceptors(FilesInterceptor('imgs', 2, {
        storage: diskStorage({
            destination: './uploads/about',
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
    async editCompanySpiritLetter(
        @Body() body: UpdateCompanySpiritLetter,
        @UploadedFiles() imgs, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.editCompanySpiritLetter(imgs, body, request);
    }

    //Sửa hình ảnh machine list (2 hình EN và JP) và nội dung đính kèm
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('company-manufacturing-machine-list')
    @UseInterceptors(FilesInterceptor('imgs', 2, {
        storage: diskStorage({
            destination: './uploads/about',
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
    async editCompanyManufacturingMachineList(
        @Body() body: UpdateCompanyManufacturingMachineList,
        @UploadedFiles() imgs, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.editCompanyManufacturingMachineList(imgs, body, request);
    }


    //iso Chỉnh sửa nội dung iso gồm 3 chức năng (add, edit, del)
    // add -> Thêm chứng chỉ iso mới thì gửi nội dung gồm hình ảnh (1 hình ảnh),name (tên chứng chỉ iso mới),  action là add
    //edit -> Cập nhật lại chứng chỉ iso thì gửi nội dung gồm hình ảnh (1 hình ảnh),name (tên chứng chỉ iso mới), edit_name (tên của chứng chỉ iso cần cập nhật), action là edit
    //del -> Xóa chứng chỉ iso thì nhập edit_name (tên của chứng chỉ iso cần cập nhật), action là del
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('iso-certification')
    @UseInterceptors(FileInterceptor('imgs', {
        storage: diskStorage({
            destination: './uploads/about',
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
    async editIsoCertification(
        @UploadedFile() img,
        @Body() body: EnterIso, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.editIsoCertification(img, body, request);
    }

    //Cập nhật lại hình ảnh của Global Customer (2 hình EN và JP)
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('global-customer')
    @UseInterceptors(FilesInterceptor('imgs', 2, {
        storage: diskStorage({
            destination: './uploads/about',
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
    async globalCustomer(
        @UploadedFiles() imgs, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.globalCustomer(imgs, request);
    }

    //Cập nhập lại hình ảnh của Branch Overview (2 hình EN và JP)
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('branch-overview-img')
    @UseInterceptors(FilesInterceptor('imgs', 2, {
        storage: diskStorage({
            destination: './uploads/about',
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
    async branchOverviewImg(
        @UploadedFiles() imgs, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.branchOverviewImg(imgs, request);
    }
    

    //Cập nhật lại tọa độ của các item của Branch Overview (2 hình EN và JP)
    //Cập nhật tọa độ hình ảnh EN -> language: en
    //Cập nhật tọa độ hình ảnh JP -> language: jp
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('branch-overview-coordinates')
    async branchOverviewCoordinates(
        @Body() body: BranchOverviewListDto, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.branchOverviewCoordinates(body, request);
    }

    //Tạo thêm item cho branch overview
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Post('add-branch-overview-item')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/about',
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
    async addBranchOverviewItem(
        @UploadedFile() img,
        @Body() body: AddBranchOverview, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.addBranchOverviewItem(img, body, request);
    }

    //Cập nhật item cho branch overview
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Patch('edit-branch-overview-item')
    @UseInterceptors(FileInterceptor('img', {
        storage: diskStorage({
            destination: './uploads/about',
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
    async editBranchOverviewItem(
        @UploadedFile() img,
        @Body() body: EditBranchOverview, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.editBranchOverviewItem(img, body, request);
    }

    //Xóa branch overview
    @UseGuards(AuthGuard)
    @HasPermission(12)
    @Delete('del-branch-overview-item/:id')
    async delBranchOverviewItem(
        @Param('id') id: number, @Req() request: Request
    ): Promise<any>{
        return await this.aboutService.delBranchOverviewItem(id, request);
    }
}
