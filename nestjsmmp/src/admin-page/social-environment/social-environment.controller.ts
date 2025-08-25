import { HasPermission } from './../../userManagement/permission/has-permission.decorator';
import { AuthGuard } from './../../userManagement/auth/auth.guard';
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UnsupportedMediaTypeException, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response, Request, request } from 'express'
import { Social } from './models/social.entity';
import { SocialEnvironmentService } from './social-environment.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InsertGroupImgDto } from './models/insertGroupImg.dto';
import { UpdateSocialDto } from './models/updateSocial.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddSocialDto } from './models/addSocial.dto';
import { LogsService } from './../../master-logs/master-logs.service';
import { UserService } from './../../userManagement/user/user.service';
import { AuthService } from './../../userManagement/auth/auth.service';

@ApiTags('Social')
@Controller('social-environment')
export class SocialEnvironmentController {
    constructor(private readonly socialEnvironmentService: SocialEnvironmentService,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ){}
    @Get('uploads/social/:path')
    async getImage(
        @Param('path') path,
        @Res() res: Response
    ) {
        res.sendFile(path, {root: 'uploads/social'})
    }

    @Get()
    async getAllImage(){
        return await this.socialEnvironmentService.getImageAll();
    }

    @Get('timeline')
    async getTimeline(){
        return await this.socialEnvironmentService.getSocietyTimeline();
    }

    @Get('img_environment')
    async getImgEnv(){
        return await this.socialEnvironmentService.getImgEnvironment();
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Post('add-image-social/:id/:index')
    @UseInterceptors(FilesInterceptor('imgs', 1, {
        storage: diskStorage({
            destination: './uploads/social',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = img.mimetype;
            if (allowedMimeTypes.includes(fileType)) {
                callback(null, true); 
            }else {
                callback(new UnsupportedMediaTypeException('ONLY FILES ARE ACCEPTED'), false);
            }
        },
    }))
    async addImageSocial(
        @Param('id') id: number,
        @Param('index') index: number,
        @UploadedFiles() imgs,
        @Req() request: Request
    ): Promise<any>{
        const  add_img = await this.socialEnvironmentService.addImageSocial(id, index, imgs[0].filename);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Thêm hình ảnh trang Social`,
            users: user.user_name,
        });
        return add_img;
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Delete('delete-image-social/:id/:index/:index_img')
    async deleteImageSocial(
        @Param('id') id: number,
        @Param('index') index: number,
        @Param('index_img') index_img: number,
        @Req() request: Request
    ){
        const  del_img = await this.socialEnvironmentService.deleteImageSocial(id, index, index_img);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);
        await this.logsService.create({
            ip_address: request.ip,
            action: `Xóa hình ảnh trang Social`,
            users: user.user_name,
        });
        return del_img; 
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Delete('delete-group-img-social/:id/:index')
    async deleteGroupImgSocial(
        @Param('id') id: number,
        @Param('index') index: number,
        @Req() request: Request
    ){
        const del_img = await this.socialEnvironmentService.deleteGroupImgSocial(id, index);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);
        await this.logsService.create({
            ip_address: request.ip,
            action: `Xóa group hình ảnh trang Social`,
            users: user.user_name,
        });
        return del_img; 
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Post('add-group-img-social')
    async addGroupImgSocial(@Body() data:InsertGroupImgDto, @Req() request: Request){
        const add_img = await this.socialEnvironmentService.addGroupImgSocial(data);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Thêm group hình ảnh trang Social`,
            users: user.user_name,
        });
        return add_img;
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Patch('update-social')
    async updateSocial(@Body() data: UpdateSocialDto, @Req() request: Request){
        const update_social = await this.socialEnvironmentService.updateSocial(data);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Update hình ảnh trang Social`,
            users: user.user_name,
        });
        return update_social
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Delete('delete-social/:id')
    async deleteSocial(@Param('id') id: number, @Req() request: Request){
        const del_img = await this.socialEnvironmentService.deleteSocial(id);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Xóa sự kiện trang Social`,
            users: user.user_name,
        });
        return del_img; 
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Post('add-social')
    async addSocial(@Body() data: AddSocialDto, @Req() request: Request){
        const add_img = await this.socialEnvironmentService.addSocial(data);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Thêm nội dung hình ảnh trang Social`,
            users: user.user_name,
        });
        return add_img;
    }

    @UseGuards(AuthGuard)
    @HasPermission(17)
    @Patch('update-environment')
    @UseInterceptors(FilesInterceptor('imgs', 1, {
        storage: diskStorage({
            destination: './uploads/social',
            filename(_, img, callback) {
                const ramdomName = Array(32).fill(null).map(() => (Math.round(Math.random() *16)).toString(16)).join('');
                return callback(null, `${ramdomName}${extname(img.originalname)}`);
            },
        }),
        fileFilter: (_, img, callback) => {
            // Kiểm tra kích thước tệp và loại tệp ở đây
            const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/PNG', 'image/JPEG', 'image/JPG'];
            const fileType = img.mimetype;
            if (allowedMimeTypes.includes(fileType)) {
                callback(null, true); 
            }else {
                callback(new UnsupportedMediaTypeException('ONLY FILES ARE ACCEPTED'), false);
            }
        },
    }))
    async updateImgEnvi(
        @UploadedFiles() imgs,
        @Req() request: Request
    ): Promise<any>{
        const update_envi = await this.socialEnvironmentService.updateImgEnvi(imgs[0].filename);
        const id_log = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_log}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Update hình ảnh môi trường`,
            users: user.user_name,
        });
        return update_envi;
    }
}
