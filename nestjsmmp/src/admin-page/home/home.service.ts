import { BadRequestException, Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomePage } from './models/homepage.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { LogsService } from 'src/master-logs/master-logs.service';
import { AuthService } from 'src/userManagement/auth/auth.service';
import { UserService } from 'src/userManagement/user/user.service';

@Injectable()
export class HomeService {
    constructor(
        @InjectRepository(HomePage)
        private readonly homepageRepo: Repository<HomePage>,
        private readonly configService: ConfigService,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ) { }
    apiUrl = this.configService.get<string>("APIURL");
    async get_content() {
        try {
            let datas = await this.homepageRepo.find()
            let data_respone = {}
            datas.forEach(element => {
                if (element.image != null) {
                    if (element.type == 'menu') {
                        // console.log("image: ", element.image)
                        try {
                            var urls = JSON.parse(element.image)
                        } catch (err) {
                            // console.log("Lỗi: ",err)
                        }
                        try {
                            var urls_jp = JSON.parse(element.image_jp)
                        } catch (err) {
                            // console.log("Lỗi: ",err)
                        }

                        // console.log("url: ", urls)
                        element.image = JSON.stringify({
                            icon: this.apiUrl + '/' + urls.icon,
                            bg: this.apiUrl + '/' + urls.bg
                        })
                        element.image_jp = JSON.stringify({
                            icon: this.apiUrl + '/' + urls_jp.icon,
                            bg: this.apiUrl + '/' + urls_jp.bg
                        })

                    } else {
                        element.image = this.apiUrl + '/' + element.image
                        if (element.image_jp) element.image_jp = this.apiUrl + '/' + element.image_jp
                    }

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
            // throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async upload_logo(files, id, request) {
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
            let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
            try {
                await this.homepageRepo.update({ id, type: 'logo' }, { image, image_jp:image })
                this.write_log(request, "Edit logo MVP")
                return await this.get_content()
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async upload_banner(files, body, request) {
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
            let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
            let image_jp = `home/get-image/${files[1].filename}`.replace(/\\/g, '/')
            const data_upload = new HomePage()
            data_upload.type = 'header'
            data_upload.image = image
            data_upload.image_jp = image_jp
            try {
                await this.homepageRepo.save(data_upload)
                this.write_log(request,"Upload banner")
                return await this.get_content()
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async edit_banner(files, id, body, request) {
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
            let data_delete = await this.homepageRepo.findOneBy({ id })
            // console.log("data_delete",data_delete)
            if (data_delete) {
                if (body.img_en == 1 && body.img_jp == 0) {
                    if(data_delete.image)
                    {
                        let file_en = 'uploads/homepage/' + data_delete.image.split('/')[2]
                        try{await this.deleteFile(file_en)}
                        catch{}
                    }
                    
                    let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    try {
                        await this.homepageRepo.update({ id , type:'header'}, { image })
                        this.write_log(request, `Edit banner id: ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_jp == 1 && body.img_en == 0) {
                    if(data_delete.image_jp){
                        let file_jp = 'uploads/homepage/' + data_delete.image_jp.split('/')[2]
                        try{await this.deleteFile(file_jp)}
                        catch{}
                    }
                    
                    
                    let image_jp = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    try {
                        await this.homepageRepo.update({ id , type:'header'}, { image_jp })
                        this.write_log(request, `Edit banner id: ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_en == 1 && body.img_jp==1) {
                    if(data_delete.image){
                        let file_en = 'uploads/homepage/' + data_delete.image.split('/')[2]
                        try{await this.deleteFile(file_en)}
                        catch{}
                    }
                    let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    if(data_delete.image_jp){
                        let file_jp = 'uploads/homepage/' + data_delete.image_jp.split('/')[2]
                        try{await this.deleteFile(file_jp)}
                        catch{}
                    }
                    
                    
                    let image_jp = `home/get-image/${files[1].filename}`.replace(/\\/g, '/')
                    try {
                        await this.homepageRepo.update({ id , type:'header'}, { image, image_jp })
                        this.write_log(request, `Edit banner id: ${id}`)
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

    async delete_banner(id, request) {
        let data_delete = await this.homepageRepo.findOneBy({ id })
        // console.log(data_delete)
        if (data_delete) {
            if(data_delete.image){
                let file_en = 'uploads/homepage/' + data_delete.image.split('/')[2]
                try {await this.deleteFile(file_en)}
                catch{}
            }
            if(data_delete.image_jp){
                let file_jp = 'uploads/homepage/' + data_delete.image_jp.split('/')[2]
                try{await this.deleteFile(file_jp)}
                catch{}
            }
            
            try {
                await this.homepageRepo.delete({ id })
                this.write_log(request, `Delete banner id: ${id}`)
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
            
        }
        return await this.get_content()
    }

    async edit_short_discription(files, id, body, request) {
        if (files.length > 0) {
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
        }

        // console.log('5')
        // console.log(body)
        let data_delete = await this.homepageRepo.findOneBy({ id })
        // console.log("data_delete",data_delete)
        if (data_delete) {
            if (files.length > 0) {
                if(data_delete.image){
                    let file_en = 'uploads/homepage/' + data_delete.image.split('/')[2]
                    try{await this.deleteFile(file_en)}
                    catch{}
                }   
                
                let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                try {
                    await this.homepageRepo.update({ id , type:'highlight'}, { image, image_jp:image,sub_discription: body.content_en, sub_discription_jp: body.content_jp })
                    this.write_log(request, `Edit short disciption id: ${id}`)
                    return await this.get_content()

                } catch (err) {
                    throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                }
            } else {
                try {
                    await this.homepageRepo.update({ id , type:'highlight'}, { sub_discription: body.content_en, sub_discription_jp: body.content_jp })
                    this.write_log(request, `Edit short discription id: ${id}`)
                    return await this.get_content()

                } catch (err) {
                    throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                }
            }


        }


    }

    async edit_story(files, id, body, request) {
        if(files && files.length>0){
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
            let data_delete = await this.homepageRepo.findOneBy({ id })
            // console.log("data_delete",data_delete)
            if (data_delete) {
                if (body.img_en == 1 && body.img_jp == 0) {
                    if(data_delete.image){
                        let file_en = 'uploads/homepage/' + data_delete.image.split('/')[2]
                        try{await this.deleteFile(file_en)}
                        catch{}
                    }
                    
                    let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    try {
                        await this.homepageRepo.update({ id , type:'story'}, { image, discription: body.content_en, discription_jp: body.content_jp })
                        this.write_log(request, `Edit story`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_jp == 1 && body.img_en == 0) {
                    if(data_delete.image_jp){
                        let file_jp = 'uploads/homepage/' + data_delete.image_jp.split('/')[2]
                        try{await this.deleteFile(file_jp)}
                        catch{}
                    }
                    
                    let image_jp = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    try {
                        await this.homepageRepo.update({ id , type:'story'}, { image_jp, discription: body.content_en, discription_jp: body.content_jp })
                        this.write_log(request, "Edit story")
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_en == 1 &&body.img_jp==1) {
                    if(data_delete.image){
                        let file_en = 'uploads/homepage/' + data_delete.image.split('/')[2]
                        try{await this.deleteFile(file_en)}
                        catch{}
                    }
                    
                    let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    if(data_delete.image_jp){
                        let file_jp = 'uploads/homepage/' + data_delete.image_jp.split('/')[2]
                        try{await this.deleteFile(file_jp)}
                        catch{}
                    }
                    
                    
                    let image_jp = `home/get-image/${files[1].filename}`.replace(/\\/g, '/')
                    try {
                        await this.homepageRepo.update({ id , type:'story'}, { image, image_jp, discription: body.content_en, discription_jp: body.content_jp })
                        this.write_log(request, "Edit story")
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                } else {
                    return await this.get_content()
                }
            }  
        }else{
            try {
                await this.homepageRepo.update({id, type:'story'}, {discription: body.content_en, discription_jp: body.content_jp })
                this.write_log(request, "Edit story")
                return await this.get_content()

            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async edit_menu(files, id, body, request) {
        if(files && files.length>0){
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
            let data_delete = await this.homepageRepo.findOneBy({ id })
            // console.log("data_delete",data_delete)
            if (data_delete) {
                if (body.img_icon == 1 && body.img_bg == 0) {
                    let images=JSON.parse(data_delete.image)
                    if(images){
                        let file_icon = 'uploads/homepage/' + images['icon'].split('/')[2]
                        try{await this.deleteFile(file_icon)}
                        catch{}
                    }
                    let icon = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    images['icon']=icon
                    let image=JSON.stringify(images)
                    try {
                        await this.homepageRepo.update({ id , type:'menu'}, { image,  image_jp:image, sub_discription: body.content_en, sub_discription_jp: body.content_jp })
                        this.write_log(request, `Edit menu id: ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_icon == 0 && body.img_bg == 1) {
                    let images=JSON.parse(data_delete.image)
                    if(images){
                        let file_bg = 'uploads/homepage/' + images['bg'].split('/')[2]
                        try{
                            await this.deleteFile(file_bg)
                        }catch{}
                    }
                    
                    
                    let bg = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    images['bg']=bg
                    let image=JSON.stringify(images)
                    try {
                        await this.homepageRepo.update({ id , type:'menu'}, { image, image_jp:image, sub_discription: body.content_en, sub_discription_jp: body.content_jp })
                        this.write_log(request, `Edit menu id: ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                }
                else if (body.img_icon == 1 && body.img_bg==1) {
                    let images=JSON.parse(data_delete.image)
                    if(images){
                        let file_icon = 'uploads/homepage/' + images['icon'].split('/')[2]
                        try{
                            await this.deleteFile(file_icon)
                        }catch{}
                    }
                    
                    
                    let icon = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
                    if(images){
                        let file_bg = 'uploads/homepage/' + images['bg'].split('/')[2]
                        try{
                            await this.deleteFile(file_bg)
                        }catch{}
                    }
                    
                    
                    let bg = `home/get-image/${files[1].filename}`.replace(/\\/g, '/')

                    images['icon']=icon
                    images['bg']=bg
                    let image=JSON.stringify(images)
                    try {
                        await this.homepageRepo.update({ id , type:'menu'}, { image, image_jp:image,sub_discription: body.content_en, sub_discription_jp: body.content_jp })
                        this.write_log(request, `Edit menu id: ${id}`)
                        return await this.get_content()

                    } catch (err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                } else {
                    return await this.get_content()
                }
            }  
        }else{
            try {
                await this.homepageRepo.update({id, type:'menu'}, {sub_discription: body.content_en, sub_discription_jp: body.content_jp })
                this.write_log(request, `Edit menu id: ${id}`)
                return await this.get_content()

            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async upload_footer(files, request) {
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
            let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
            let data_upload= new HomePage()
            data_upload.type='footer'
            data_upload.image=image
            data_upload.image_jp=image
            try {
                await this.homepageRepo.insert(data_upload)
                this.write_log(request, "Upload client")
                return await this.get_content()
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async edit_footer(files, id, request) {
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
            let image = `home/get-image/${files[0].filename}`.replace(/\\/g, '/')
            try {
                await this.homepageRepo.update({ id, type: 'footer' }, { image, image_jp:image })
                this.write_log(request, `Edit client id: ${id}`)
                return await this.get_content()
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
        }

    }

    async delete_footer(id, request) {
        let data_delete = await this.homepageRepo.findOneBy({ id })
        // console.log(data_delete)
        if (data_delete) {
            if(data_delete.image){
                let file = 'uploads/homepage/' + data_delete.image.split('/')[2]
                try {await this.deleteFile(file)}
                catch{}
            }
            
            try {
                await this.homepageRepo.delete({ id })
                this.write_log(request, `Delete client id: ${id}`)
            } catch (err) {
                throw new InternalServerErrorException(err, { cause: new Error(), description: err });
            }
            
        }
        return await this.get_content()
    }

    async edit_comment_footer(id,body, request){
        try {
            await this.homepageRepo.update({ id, type: 'footer_comment' }, { discription:body.content_en, discription_jp:body.content_jp })
            this.write_log(request, "Edit comment client")
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
