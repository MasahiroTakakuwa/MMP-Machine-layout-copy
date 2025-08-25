import { HasPermission } from './../../userManagement/permission/has-permission.decorator';
import { AuthGuard } from './../../userManagement/auth/auth.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UnsupportedMediaTypeException, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express'
import { InsertTrainGroupDto, UpdateTrainGroupDto } from './models/insertTrainGroup.dto';
import { InsertJobGroupDto, InsertNewJobDto, UpdateJobGroupDto, UpdateNewJobDto } from './models/jobDepartment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { LogsService } from './../../master-logs/master-logs.service';
import { UserService } from './../../userManagement/user/user.service';
import { AuthService } from './../../userManagement/auth/auth.service';


@ApiTags('Recruitment')
@Controller('recruitment')
export class RecruitmentController {
    constructor(
        private recruitmentService : RecruitmentService,

        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
        ){
    }

    @Get('uploads/recruitment/:path')
    async getImage(
        @Param('path') path,
        @Res() res: Response
    ) {
        res.sendFile(path, {root: 'uploads/recruitment'})
    }

    // @Get('get-path-background')
    // async getBackground(){
    //     return this.recruitmentService.getPathBackground();
    // }

    //******* */ Phần tuyển dụng
    @Get()
    async getAllJob(){
        return await this.recruitmentService.findAll(false);
    }

    @Get('recruitment')
    async getRecruitment(){
        return await this.recruitmentService.findAll(true);
    }

    //Thêm bộ phận 
    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Post('insert-group-job')
    async addGroupJob(@Body() data:InsertJobGroupDto, @Req() request: Request){
        const  add_group = await this.recruitmentService.addGroupJob(data);
        const id = await this.authService.userId(request);
        let user = await this.userService.findOne({id}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Thêm bộ phận ${data.name}`,
            users: user.user_name,
        });
        return add_group;
    }

    //Đổi tên bộ phận
    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Put('edit-group-job')
    async editNameGroupJob(@Body() data:UpdateJobGroupDto, @Req() request: Request){
        const edit_group = await this.recruitmentService.editNameGroupJob(data);
        const id = await this.authService.userId(request);
        let user = await this.userService.findOne({id}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Đổi tên bộ phận ${edit_group.name_vi} thành ${data.name}`,
            users: user.user_name,
        });
        return edit_group;
    }

    //Xóa bộ phận
    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Delete('remove-group-job/:id')
    async removeGroupJob(@Param('id') id:number, @Req() request: Request){
        const del_group = await this.recruitmentService.removeGroupJob(id);
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Xóa bộ phận ${del_group.name_vi}`,
            users: user.user_name,
        });
        return del_group;
    }

    //Thêm job
    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Post('insert-job')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            category: { type: 'string' },
            pdf_file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @UseInterceptors(FilesInterceptor('pdf_file',1 ,{
        storage: diskStorage({
            destination: './uploads/recruitment',
            filename(_, file, callback) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const originalName = file.originalname.replace(/\.([a-z]+)$/i, '');
                callback(null, `${originalName}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`);
            },
        }),
        fileFilter: (_, pdf_file, callback) => {
            const fileType = pdf_file.mimetype;
            if (fileType == 'application/pdf') {
                callback(null, true); 
            }else {
                callback(new UnsupportedMediaTypeException('ONLY FILES *.pdf ARE ACCEPTED'), false)
            }
        },
    }))
    async addJob(@UploadedFiles() pdf_file, @Body() data:InsertNewJobDto, @Req() request: Request){
        for (const key of Object.keys(data)) {
            try {
                data[key] = JSON.parse(data[key]);
            } catch (error) {
                data[key] = data[key];
            }
        }
        const add_job = await this.recruitmentService.insertJob({
            name_vi: data.name, 
            pdf_file: 'recruitment/uploads/recruitment/' + pdf_file[0].filename, 
            name_en: ' ', 
            name_jp:' ', 
            status:'active',
            category: data.category
        });
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Thêm vị trí tuyển dụng: ${data.name}`,
            users: user.user_name,
        });
        return add_job;
    }

    //sửa job
    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Put('edit-job')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            category: { type: 'integer' },
            status: { type: 'string' },
            pdf_file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @UseInterceptors(FilesInterceptor('pdf_file',1 ,{
        storage: diskStorage({
            destination: './uploads/recruitment',
            filename(_, file, callback) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const originalName = file.originalname.replace(/\.([a-z]+)$/i, '');
                callback(null, `${originalName}-${uniqueSuffix}.${file.mimetype.split('/')[1]}`);
            },
        }),
        fileFilter: (_, file, callback) => {
            const fileType = file.mimetype;
            if (fileType == 'application/pdf') {
                callback(null, true); 
            }else {
                callback(new UnsupportedMediaTypeException('ONLY FILES *.pdf ARE ACCEPTED'), false)
            }
        },
    }))
    async editJob(@UploadedFiles() pdf_file, @Body() data: UpdateNewJobDto, @Req() request: Request){
        for (const key of Object.keys(data)) {
            try {
                data[key] = JSON.parse(data[key]);
            } catch (error) {
                data[key] = data[key];
            }
        }
        const data_update = {};
        data_update['id'] = data['id'];
        if(data.category != null && data.category != ''){
            data_update['category'] = data['category'];
        }
        if(data.name != null&&data.name != ''){
            data_update['name_vi'] = data['name'];
        }
        if(data.status != null&&data.status != ''){
            data_update['status'] = data['status'];
        }
        if(pdf_file.length >0 ){
            data_update['pdf_file'] = 'recruitment/uploads/recruitment/' + pdf_file[0].filename;
        }
        const edit_job = await this.recruitmentService.editJob(data.id, data_update);
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Sửa đổi thông tin tuyển dụng của vị trí: ${data.name}`,
            users: user.user_name,
        });
        return edit_job;
    }

    //Xóa job
    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Delete('remove-job/:id')
    async removeJob(@Param('id') id:number, @Req() request: Request){
        const del_job = await this.recruitmentService.removeJob(id);
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Xóa thông tin tuyển dụng vị trí: ${del_job.name_vi}`,
            users: user.user_name,
        });
        return del_job;
    }
    //******** */ Kết thúc phần tuyển dụng

    //***********Phần chính sách phúc lợi và đào tạo
    @Get('train')
    async getWelfareTrain(){
        return await this.recruitmentService.findWelfareTrain();
    }

    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Post('insert-train-group')
    async addTrainGroup(@Body() data: InsertTrainGroupDto, @Req() request: Request){
        const add_ = await this.recruitmentService.insertJob({name_vi: data.name.vi, pdf_file: JSON.stringify(data.description), name_en: data.name.en, name_jp:data.name.jp, status:'inactive'});
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Thêm mục '${data.name}' trong chính sách phúc lợi và đào tạo`,
            users: user.user_name,
        });
        return add_;
    }

    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Put('edit-train-group')
    async editTrainGroup(@Body() data: UpdateTrainGroupDto, @Req() request: Request){
        if(data.description != null){
            data['pdf_file'] = JSON.stringify(data.description);
            delete data.description;
        }
        if(data.name != null){
            data['name_vi'] = data.name.vi;
            data['name_en'] = data.name.en;
            data['name_jp'] = data.name.jp;
            delete data.name;
        }

        const edit_ = await this.recruitmentService.editTrainGroup(data);
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Sửa mục '${edit_.name_vi}' trong chính sách phúc lợi và đào tạo`,
            users: user.user_name,
        });
        return this.recruitmentService.findWelfareTrain();
    }

    @UseGuards(AuthGuard)
    @HasPermission(19)
    @Delete('delete-train-group/:id')
    async removeTrainGroup(@Param('id') id:number, @Req() request: Request){
        const del_ = await this.recruitmentService.removeJob(id);
        const id_user = await this.authService.userId(request);
        let user = await this.userService.findOne({id: id_user}, ['role', 'department']);

        await this.logsService.create({
            ip_address: request.ip,
            action: `Xóa mục '${del_.name_vi}' trong chính sách phúc lợi và đào tạo`,
            users: user.user_name,
        });
        return this.recruitmentService.findWelfareTrain();
    }
    // Kết thúc phần chính sách ...



    // @Put('inactive-job/:id')
    // async editJodToInactive(@Param('id') id: number){
    //     return this.recruitmentService.inactiveJob(id);
    // }

    // @Put('rename-job')
    // async renameJob(@Body() data: {id: number, name: string}){
    //     return this.recruitmentService.editJob(data.id, data.name);
    // }

    // @Delete(':id')
    // async deleteJob(@Param('id') id:number){
    //     return this.recruitmentService.removeJob(id);
    // }

    // @Post('job-description')
    // async addJobDescription(@Body() data: InsertJobDescriptionDto){
    //     return this.recruitmentService.insertJobDescription(data);
    // }

    // @Put('edit-description')
    // async editJobDescription(@Body() data:{id: number, description_detail: string}){
    //     return this.recruitmentService.updateJobDescription(data.id, data.description_detail);
    // }

    // @Delete('job-description/:id')
    // async deleteJobDescription(@Param('id') id:number){
    //     return this.recruitmentService.removeJobDescription(id);
    // }

    // @Post('register')
    // async registerEmail(@Body(ValidationPipe) data: EmailDto){
    //     return await this.recruitmentService.saveEmail(data);
    // }


}
