import { BadRequestException, Injectable, InternalServerErrorException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QualityPageEntity } from './models/quality.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { LogsService } from 'src/master-logs/master-logs.service';
import { AuthService } from 'src/userManagement/auth/auth.service';
import { UserService } from 'src/userManagement/user/user.service';

@Injectable()
export class QualityService {
    constructor(@InjectRepository(QualityPageEntity)
                private readonly qualityRepo: Repository<QualityPageEntity>,
                private readonly configService: ConfigService,
                private logsService: LogsService,
                private userService: UserService,
                private authService: AuthService
        ) { }

    apiUrl = this.configService.get<string>("APIURL");
    async get_content() {
        try {
            let datas = await this.qualityRepo.find()
            let data_respone = {}
            datas.forEach(element => {
                if (element.image != null) {
                    element.image = this.apiUrl + '/' + element.image
                    element.image_jp = this.apiUrl + '/' + element.image_jp
                }
                if (data_respone[element.type] == undefined) {
                    data_respone[element.type] = [element]
                } else {
                    data_respone[element.type].push(element)
                }
            })
            return { data: data_respone }
        } catch (err) {
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code })
        }


    }

    async deleteFile(filePath: string): Promise<void> {
        try {
            return new Promise<void>((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        // console.log(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
        catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async upload_quality(files, body, request) {
        // console.log('1')
        if (!files) {
            // console.log('2')
            throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
        }
        else {
            // console.log('3')
            let flag_files_error = false
            files.forEach(file => {
                if (file.size >= 5 * 1024 * 1024) {
                    flag_files_error = true
                }
            })
            if (flag_files_error) {
                // console.log('4')
                files.forEach(file => {
                    this.deleteFile(file.path)
                })
                throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
            }
            // console.log('5')
            // console.log(body)
            let image = `quality/get-image/${files[0].filename}`.replace(/\\/g, '/')
            let image_jp = `quality/get-image/${files[1].filename}`.replace(/\\/g, '/')
            const data_upload = new QualityPageEntity()
            data_upload.type = body.type
            data_upload.image = image
            data_upload.image_jp = image_jp
            data_upload.title = body.title
            try {
                await this.qualityRepo.insert(data_upload)
                this.write_log(request, `Upload quality ${body.title}`)
                return await this.get_content()
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async edit_quality(files, id, body, request) {
        // console.log('1')
        if (!files) {
            // console.log('2')
            throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
        }
        else {
            // console.log('3')
            let flag_files_error = false
            files.forEach(file => {
                if (file.size >= 5 * 1024 * 1024) {
                    flag_files_error = true
                }
            })
            if (flag_files_error) {
                // console.log('4')
                files.forEach(file => {
                    this.deleteFile(file.path)
                })
                throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
            }
            // console.log("id",id)
            let data_delete = await this.qualityRepo.findOneBy({ id })
            // console.log("data_delete",data_delete)
            if (data_delete) {
                if (body.img_en == 1 && body.img_jp == 0) {
                    if(data_delete.image){
                        let file_en = 'uploads/quality/' + data_delete.image.split('/')[2]
                        try{await this.deleteFile(file_en)}
                        catch{}
                    }
                    
                    let image = `quality/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    try {
                        await this.qualityRepo.update({ id }, { image })
                        this.write_log(request, `Edit quality id: ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_jp == 1 && body.img_en == 0) {
                    if(data_delete.image_jp){
                        let file_jp = 'uploads/quality/' + data_delete.image_jp.split('/')[2]
                        try{await this.deleteFile(file_jp)}
                        catch{}
                    }
                    
                    
                    let image_jp = `quality/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    try {
                        await this.qualityRepo.update({ id }, { image_jp })
                        this.write_log(request, `Edit quality id: ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_en == 1 && body.img_jp==1) {
                    if(data_delete.image){
                        let file_en = 'uploads/quality/' + data_delete.image.split('/')[2]
                        try{await this.deleteFile(file_en)}
                        catch{}
                    }

                    let image = `quality/get-image/${files[0].filename}`.replace(/\\/g, '/')

                    if(data_delete.image_jp){
                        let file_jp = 'uploads/quality/' + data_delete.image_jp.split('/')[2]
                        try{await this.deleteFile(file_jp)}
                        catch{}
                    }
                    
                    
                    let image_jp = `quality/get-image/${files[1].filename}`.replace(/\\/g, '/')
                    try {
                        await this.qualityRepo.update({ id }, { image, image_jp })
                        this.write_log(request, `Edit quality ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                } else {
                    return await this.get_content()
                }
            }

        }

    }

    async delete_quality(id, request) {
        let data_delete = await this.qualityRepo.findOneBy({ id })
        // console.log(data_delete)
        if (data_delete) {
            if(data_delete.image){
                let file_en = 'uploads/quality/' + data_delete.image.split('/')[2]
                try {await this.deleteFile(file_en)}
                catch{}
            }
            if(data_delete.image_jp){
                let file_jp = 'uploads/quality/' + data_delete.image_jp.split('/')[2]
                try{await this.deleteFile(file_jp)}
                catch{}
            }
            
            try {
                await this.qualityRepo.delete({ id })
                this.write_log(request, `Delete quality id: ${id}`)
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }
        return await this.get_content()
    }

    async upload_quality_equipment(files, body, request) {
        // console.log('1')
        if (!files) {
            // console.log('2')
            throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
        }
        else {
            // console.log('3')
            let flag_files_error = false
            files.forEach(file => {
                if (file.size >= 5 * 1024 * 1024) {
                    flag_files_error = true
                }
            })
            if (flag_files_error) {
                // console.log('4')
                files.forEach(file => {
                    this.deleteFile(file.path)
                })
                throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
            }
            // console.log('5')
            // console.log(body)
            let image = `quality/get-image/${files[0].filename}`.replace(/\\/g, '/')
            const data_upload = new QualityPageEntity()
            data_upload.type = body.type
            data_upload.image = image
            data_upload.feature = body.content_en
            data_upload.feature_jp = body.content_jp
            data_upload.title = body.title
            try {
                await this.qualityRepo.insert(data_upload)
                this.write_log(request, `Upload equipment ${body.content_en}`)
                return await this.get_content()
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async edit_quality_equipment(files, id, body, request) {
        // console.log('1')
        if (files && files.length > 0) {
            // console.log('3')
            let flag_files_error = false
            files.forEach(file => {
                if (file.size >= 5 * 1024 * 1024) {
                    flag_files_error = true
                }
            })
            if (flag_files_error) {
                // console.log('4')
                files.forEach(file => {
                    this.deleteFile(file.path)
                })
                throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
            }
            // console.log('5')
            // console.log(body)
            let data_delete = await this.qualityRepo.findOneBy({ id })
            // console.log("data_delete",data_delete)
            if (data_delete) {
                if(data_delete.image){
                    let file_en = 'uploads/quality/' + data_delete.image.split('/')[2]
                    try{await this.deleteFile(file_en)}
                    catch{}
                }
                
                
                let image = `quality/get-image/${files[0].filename}`.replace(/\\/g, '/')
                try {
                    await this.qualityRepo.update({ id }, { image, image_jp: image,feature: body.content_en, feature_jp: body.content_jp })
                    this.write_log(request, `Edit equipment id: ${id}`)
                    return await this.get_content()

                } catch (err) {
                    throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                }

            }
        } else {
            // console.log('5')
            // console.log(body)
            try {
                await this.qualityRepo.update({ id }, { feature: body.content_en, feature_jp: body.content_jp })
                this.write_log(request, `Edit equipment id: ${id}`)
                return await this.get_content()
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }



    }

    async delete_equipment(id, request) {
        let data_delete = await this.qualityRepo.findOneBy({ id })
        // console.log(data_delete)
        if (data_delete) {
            if(data_delete.image){
                let file = 'uploads/quality/' + data_delete.image.split('/')[2]
                try{await this.deleteFile(file)}
                catch{}
            }
            
            try {
                await this.qualityRepo.delete({ id })
                this.write_log(request, `Delete equipment id: ${id}`)
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }
        return await this.get_content()
    }

    async update_comment(id, body, request) {
        try {
            // console.log(body)
            await this.qualityRepo.update({ id, type: 'quality_control_equipment_comment' }, { feature: body.content_en, feature_jp: body.content_jp })
            this.write_log(request, `Edit comment equipment`)
            return await this.get_content()

        } catch (err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async write_log(request, action) {
        const id = await this.authService.userId(request)
        let user = await this.userService.findOne({ id }, ['role', 'department']);
        await this.logsService.create({
            ip_address: request.ip,
            action: action,
            users: user.user_name,
        })
    }


}

