import { AbstractService } from 'src/userManagement/common/abstract.service';
import { BadRequestException, Injectable, InternalServerErrorException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { About } from './models/about.entity';
import { EntityManager, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UpdateCompanyInformation } from './models/about-company-information.dto';

import { UpdateCompanySpiritLetter } from './models/about-spirit.dto';
import { UpdateCompanyManufacturingMachineList } from './models/about-company-manufacturing-machine-list.dto';
import { EnterIso } from './models/iso.dto';
import { BranchOverviewListDto } from './models/branch-overview.dto';
import { AddBranchOverview } from './models/add-branch-overview.dto';
import { EditBranchOverview } from './models/edit-branch-overview.dto';
import { LogsService } from 'src/master-logs/master-logs.service';
import { AuthService } from 'src/userManagement/auth/auth.service';
import { UserService } from 'src/userManagement/user/user.service';

@Injectable()
export class AboutService extends AbstractService{
    constructor(
        @InjectRepository(About) private readonly about: Repository<About>,

        private readonly configService: ConfigService,
        private readonly entityManager: EntityManager,
        private logsService: LogsService,
        private userService: UserService,
        private authService: AuthService
    ){
        super(about);
    }

    apiUrl = this.configService.get<string>("APIURL");

    async containsBraces(inputString) {
        const regex = /[{}]/;
        return regex.test(inputString);
    }

    async getInfoPage(): Promise<void[]> {
        try{
            const result = await super.all();
            result.forEach( async (aboutItem) => {
                if(aboutItem.content !== null){
                    const checkContent = await this.containsBraces(aboutItem.content)
                    if(checkContent === true){
                        try{
                            aboutItem.content = JSON.parse(aboutItem.content);
                            aboutItem.content_jp = JSON.parse(aboutItem.content_jp);
                        }catch(err){
                            // console.log("Error: ",aboutItem.content)
                        }
                        
                    }

                    //spirit
                    if(aboutItem.item === 'company-spirit'){
                        if(aboutItem.content.general_director_avatar && aboutItem.content.general_director_signature){
                            aboutItem.content.general_director_avatar = this.apiUrl + '/' + aboutItem.content.general_director_avatar;
                            aboutItem.content.general_director_signature = this.apiUrl + '/' + aboutItem.content.general_director_signature;
                        }
                        if(aboutItem.content_jp.general_director_avatar && aboutItem.content_jp.general_director_signature){
                            aboutItem.content_jp.general_director_avatar = this.apiUrl + '/' + aboutItem.content_jp.general_director_avatar;
                            aboutItem.content_jp.general_director_signature = this.apiUrl + '/' + aboutItem.content_jp.general_director_signature;
                        }
                    }
                    
                    //iso
                    if(aboutItem.item === 'iso-certification'){
                        aboutItem.content.forEach(iso => {
                            iso.img =  this.apiUrl + '/' + iso.img;
                        })
                        aboutItem.content_jp.forEach(iso => {
                            iso.img =  this.apiUrl + '/' + iso.img;
                        })
                    }
                }
                if(aboutItem.img && aboutItem.img_jp){
                    aboutItem.img = this.apiUrl + '/' + aboutItem.img;
                    aboutItem.img_jp = this.apiUrl + '/' + aboutItem.img_jp;
                }
            })
            return result;
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async editCompanyInformation(img: Express.Multer.File, body: UpdateCompanyInformation, request): Promise<any> {
        try{
            const companyInformationCurrent = await this.about.findOne({
                where: {
                    item: 'company-information',
                    describe: 'company-information'
                }
            })

            companyInformationCurrent.content = JSON.parse(companyInformationCurrent.content);
            companyInformationCurrent.content_jp = JSON.parse(companyInformationCurrent.content_jp);
            // return companyInformationCurrent;
            let updateContent: any = companyInformationCurrent.content;
            let updateContentJp: any = companyInformationCurrent.content_jp;

            for (const key of Object.keys(body)) {
                try {
                    body[key] = JSON.parse(body[key]);
                } catch (error) {
                  body[key] = body[key];
                }
            }

            //title
            if(body.title && body.title_jp){
                updateContent.title = body.title;
                updateContentJp.title = body.title_jp;
            }

            //established
            if(body.established && body.established_jp){
                updateContent.established = body.established;
                updateContentJp.established = body.established_jp;
            }
            //business
            if(body.business && body.business_jp){
                updateContent.business = body.business;
                updateContentJp.business = body.business_jp;
            }
            //capital
            if(body.capital && body.capital_jp){
                updateContent.capital = body.capital;
                updateContentJp.capital = body.capital_jp;
            }
            //shareholder
            if(body.shareholder && body.shareholder_jp && Array.isArray(body.shareholder) && Array.isArray(body.shareholder_jp)){
                updateContent.shareholder = body.shareholder;
                updateContentJp.shareholder = body.shareholder_jp;
            }
            // certification
            if(body.certification && body.certification_jp && Array.isArray(body.certification) && Array.isArray(body.certification_jp)){
                updateContent.certification = body.certification;
                updateContentJp.certification = body.certification_jp;
            }
            // site_area
            if(body.site_area && body.site_area_jp){
                updateContent.site_area = body.site_area;
                updateContentJp.site_area = body.site_area_jp;
            }
            // building_area
            if(body.building_area && body.building_area_jp){
                updateContent.building_area = body.building_area;
                updateContentJp.building_area = body.building_area_jp;
            }
            // revenue
            if(body.revenue && body.revenue){
                updateContent.revenue = body.revenue;
                updateContentJp.revenue = body.revenue_jp;
            }
            // staff
            if(body.staff && body.staff_jp){
                updateContent.staff = body.staff;
                updateContentJp.staff = body.staff_jp;
            }

            
            let bodyContentUpdate: any;
            if(img){
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    await this.deleteFile(`uploads/about/${companyInformationCurrent.img.split('/').pop()}`);
                    const updateImg = `about/${img.path}`.replace(/\\/g, '/');
                    bodyContentUpdate = {
                        content: JSON.stringify(updateContent),
                        content_jp: JSON.stringify(updateContentJp),
                        img: updateImg,
                        img_jp: updateImg
                    }
                }
            }
            else{
                bodyContentUpdate = {
                    content: JSON.stringify(updateContent),
                    content_jp: JSON.stringify(updateContentJp)
                }
            }
            await this.about.update({id: companyInformationCurrent.id}, bodyContentUpdate);
            this.write_log(request, "Sửa thông tin công ty trang about us")
            return await this.getInfoPage();

        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    

    async editCompanySpirit(imgs: Array<Express.Multer.File>, request): Promise<any> {
        try{
            if(!imgs){
                throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
            }
            else{
                if(imgs.length === 2){
                    if(imgs[0].size >= 5 * 1024 * 1024 || imgs[1].size >= 5 * 1024 * 1024){
                        await this.deleteFile(imgs[0].path);
                        await this.deleteFile(imgs[1].path);
                        throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                    }
                    else{
                        const updateImg = `about/${imgs[0].path}`.replace(/\\/g, '/');
                        const updateImgJp = `about/${imgs[1].path}`.replace(/\\/g, '/');

                        //Khai báo đối tượng background để update overall
                        const updateImgSpirit : any = {
                            img: updateImg,
                            img_jp: updateImgJp
                        };

                        //Tìm dữ liệu trước đó của page 1
                        const companySpiritCurrent = await this.about.findOne({
                            where: {
                                item: 'company-spirit',
                                describe: 'company-spirit'
                            }
                        })
                        //Tiến hành cập nhật mysql
                        try{
                            await this.entityManager.transaction( async transactionalEntityManager => {
                                //update background
                                transactionalEntityManager.update(About, companySpiritCurrent.id, updateImgSpirit);
                            });
                            this.write_log(request, "Cập nhật hình ảnh spirit")
                            //Sau khi cập nhật mysql thì xóa hình ảnh cũ đi
                            await this.deleteFile(`uploads/about/${companySpiritCurrent.img.split('/').pop()}`);
                            await this.deleteFile(`uploads/about/${companySpiritCurrent.img_jp.split('/').pop()}`);
                            return await this.getInfoPage();
                        }
                        catch(err) {
                            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                        }
                    }
                    
                }
                else{
                    throw new BadRequestException('ERROR. PLEASE UPLOAD 2 FILES EN , JP', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD 2 FILES EN , JP' });
                }
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }


    async editCompanySpiritLetter(imgs: Array<Express.Multer.File>, body: UpdateCompanySpiritLetter, request): Promise<any> {
        try{

            const companySpiritLetter = await this.about.findOne({
                where: {
                    item: 'company-spirit',
                    describe: 'company-spirit'
                }
            })
            const updateContent =  JSON.parse(companySpiritLetter.content);
            const updateContentJp =  JSON.parse(companySpiritLetter.content_jp);
            
            if(imgs.length === 1){
                //update avatar
                if(imgs[0].size >= 5 * 1024 * 1024){
                    await this.deleteFile(imgs[0].path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    if(body.is_avatar === 'true'){
                        const oldImgAvatar = updateContent.general_director_avatar;
                        const updateImgAvatar = `about/${imgs[0].path}`.replace(/\\/g, '/');
                        updateContent.general_director_avatar = updateImgAvatar;
                        updateContentJp.general_director_avatar = updateImgAvatar;
                        await this.deleteFile(`uploads/about/${oldImgAvatar.split('/').pop()}`);
                    }
                    else if(body.is_signature === 'true'){
                        const oldImgSignature = updateContent.general_director_signature;
                        const updateImgSignature = `about/${imgs[0].path}`.replace(/\\/g, '/');
                        updateContent.general_director_signature = updateImgSignature;
                        updateContentJp.general_director_signature = updateImgSignature;
                        await this.deleteFile(`uploads/about/${oldImgSignature.split('/').pop()}`);
                    }
                }
            }
            //update avatar and signature
            else if(imgs.length === 2){
                if(body.is_avatar !== 'true' || body.is_signature !== 'true'){
                    throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
                }
                else{
                    if(imgs[0].size >= 5 * 1024 * 1024 || imgs[1].size >= 5 * 1024 * 1024){
                        await this.deleteFile(imgs[0].path);
                        await this.deleteFile(imgs[1].path);
                        throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                    }
                    else{
                        const oldImgAvatar = updateContent.general_director_avatar;
                        const oldImgSignature = updateContent.general_director_signature;

                        const updateImgAvatar = `about/${imgs[0].path}`.replace(/\\/g, '/');
                        const updateImgSignature = `about/${imgs[1].path}`.replace(/\\/g, '/');

                        updateContent.general_director_avatar = updateImgAvatar;
                        updateContent.general_director_signature = updateImgSignature;

                        updateContentJp.general_director_avatar = updateImgAvatar;
                        updateContentJp.general_director_signature = updateImgSignature;

                        await this.deleteFile(`uploads/about/${oldImgAvatar.split('/').pop()}`);
                        await this.deleteFile(`uploads/about/${oldImgSignature.split('/').pop()}`);
                    }
                }
            }

            for (const key of Object.keys(body)) {
                try {
                    body[key] = JSON.parse(body[key]);
                } catch (error) {
                  body[key] = body[key];
                }
            }

            if(body.general_director_letter && body.general_director_letter_jp){
                updateContent.general_director_letter = body.general_director_letter;
                updateContentJp.general_director_letter = body.general_director_letter_jp;
            }

            if(body.general_director_name){
                updateContent.general_director_name = updateContentJp.general_director_name = body.general_director_name;
            }
            const updateSpiritLetter = {
                content: JSON.stringify(updateContent),
                content_jp: JSON.stringify(updateContentJp)
            }
            await this.about.update({id: companySpiritLetter.id}, updateSpiritLetter)
            this.write_log(request, "Sửa nội dung tâm thư của tổng giám đốc")

            return await this.getInfoPage();
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async editCompanyManufacturingMachineList(imgs: Array<Express.Multer.File>, body: UpdateCompanyManufacturingMachineList, request): Promise<any> {
        try{

            const companyMachineList = await this.about.findOne({
                where: {
                    item: 'machine-list',
                    describe: 'machine-list'
                }
            })

            if(imgs.length === 2){
                if(imgs[0].size >= 5 * 1024 * 1024 || imgs[1].size >= 5 * 1024 * 1024){
                    await this.deleteFile(imgs[0].path);
                    await this.deleteFile(imgs[1].path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    const oldImgEn = companyMachineList.img;
                    const oldImgJp = companyMachineList.img_jp;

                    const updateImgEn = `about/${imgs[0].path}`.replace(/\\/g, '/');
                    const updateImgJp = `about/${imgs[1].path}`.replace(/\\/g, '/');

                    companyMachineList.img = updateImgEn;
                    companyMachineList.img_jp = updateImgJp;

                    await this.deleteFile(`uploads/about/${oldImgEn.split('/').pop()}`);
                    await this.deleteFile(`uploads/about/${oldImgJp.split('/').pop()}`);
                }
            }
            else if(imgs.length === 1){
                throw new BadRequestException('ERROR. PLEASE UPLOAD 2 FILES EN , JP', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD 2 FILES EN , JP' });
            }

            for (const key of Object.keys(body)) {
                try {
                    body[key] = JSON.parse(body[key]);
                } catch (error) {
                  body[key] = body[key];
                }
            }
            if(body.content && body.content_jp){
                companyMachineList.content = body.content;
                companyMachineList.content_jp = body.content_jp;
            }

            await this.about.update({id: companyMachineList.id}, companyMachineList)
            this.write_log(request, "Sửa hình ảnh machine list")

            return await this.getInfoPage();
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async editIsoCertification(img: Express.Multer.File, body: EnterIso, request): Promise<any> {
        try{

            //dữ liệu của iso
            const isoCertification = await this.about.findOne({
                where: {
                    item: 'iso-certification',
                    describe: 'iso-certification'
                }
            })
            const isoCertificationContent = JSON.parse(isoCertification.content);

            //xử lý body
            for (const key of Object.keys(body)) {
                try {
                    body[key] = JSON.parse(body[key]);
                } catch (error) {
                  body[key] = body[key];
                }
            }

            if(body.action === 'add'){
                if(!img){
                    throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
                }
                else if(!body.name){
                    throw new BadRequestException('EMPTY NAME', { cause: new Error(), description: 'EMPTY NAME' });
                }
                else{
                    if(img.size >= 5 * 1024 * 1024){
                        await this.deleteFile(img.path);
                        throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                    }
                    else{
                        const newImg = `about/${img.path}`.replace(/\\/g, '/');
                        const updateContent = {
                            name: body.name,
                            img: newImg
                        }
                        isoCertificationContent.push(updateContent);
                        const bodyUpdate = {
                            content: JSON.stringify(isoCertificationContent),
                            content_jp: JSON.stringify(isoCertificationContent)
                        }
                        await this.about.update({id: isoCertification.id}, bodyUpdate);
                        this.write_log(request, "Thêm chứng chỉ iso")
                        return await this.getInfoPage();
                    }
                }
            }
            else if(body.action === 'edit' && body.edit_name){
                if(!img){
                    throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
                }
                else if(!body.name){
                    throw new BadRequestException('EMPTY NAME', { cause: new Error(), description: 'EMPTY NAME' });
                }
                else{
                    if(img.size >= 5 * 1024 * 1024){
                        await this.deleteFile(img.path);
                        throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                    }
                    else{
                        const newImg = `about/${img.path}`.replace(/\\/g, '/');
                        const updateContent = {
                            name: body.name,
                            img: newImg
                        }
                        // xóa hình và cập nhật lại content 
                        let oldImgIso : string = null;
                        isoCertificationContent.forEach(imgItem => {
                            if(imgItem.name === body.edit_name){
                                oldImgIso = imgItem.img;
                            }
                        })

                        if(oldImgIso === null){
                            throw new BadRequestException('ERROR. PLEASE TRY AGAIN', { cause: new Error(), description: 'ERROR. PLEASE TRY AGAIN' });
                        }
                        else{

                            await this.deleteFile(`uploads/about/${oldImgIso.split('/').pop()}`);
                            const resEdit = isoCertificationContent.filter(item => item.name !== body.edit_name);

                            resEdit.push(updateContent);

                            const bodyUpdate = {
                                content: JSON.stringify(resEdit),
                                content_jp: JSON.stringify(resEdit)
                            }
                            await this.about.update({id: isoCertification.id}, bodyUpdate);
                            this.write_log(request, `Chỉnh sửa chứng chỉ iso id: ${isoCertification.id}`)
                            return await this.getInfoPage();
                        }
                    }
                }
            }
            else if(body.action === 'del'){
                let oldImgIso : string = null;
                isoCertificationContent.forEach(imgItem => {
                    if(imgItem.name === body.edit_name){
                        oldImgIso = imgItem.img;
                    }
                });

                if(oldImgIso === null){
                    throw new BadRequestException('ERROR. PLEASE TRY AGAIN', { cause: new Error(), description: 'ERROR. PLEASE TRY AGAIN' });
                }
                else{

                    await this.deleteFile(`uploads/about/${oldImgIso.split('/').pop()}`);
                    const resDel = isoCertificationContent.filter(item => item.name !== body.edit_name);
                    const bodyUpdate = {
                        content: JSON.stringify(resDel),
                        content_jp: JSON.stringify(resDel)
                    }
                    await this.about.update({id: isoCertification.id}, bodyUpdate);
                    this.write_log(request, `Xóa chứng chỉ iso ${isoCertification.id}`)
                    return await this.getInfoPage();
                }
            }
            else{
                throw new BadRequestException('ERROR. PLEASE TRY AGAIN', { cause: new Error(), description: 'ERROR. PLEASE TRY AGAIN' });
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async globalCustomer(imgs: Array<Express.Multer.File>, request): Promise<any> {
        try{
            if(!imgs){
                throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
            }
            else{
                if(imgs.length === 2){
                    if(imgs[0].size >= 5 * 1024 * 1024 || imgs[1].size >= 5 * 1024 * 1024){
                        await this.deleteFile(imgs[0].path);
                        await this.deleteFile(imgs[1].path);
                        throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                    }
                    else{

                        //Tìm dữ liệu trước đó của page 1
                        const globalCustomer = await this.about.findOne({
                            where: {
                                item: 'global-customer',
                                describe: 'global-customer'
                            }
                        })

                        const updateImg = `about/${imgs[0].path}`.replace(/\\/g, '/');
                        const updateImgJp = `about/${imgs[1].path}`.replace(/\\/g, '/');

                        //Khai báo đối tượng background để update
                        const updateImgGlobal : any = {
                            img: updateImg,
                            img_jp: updateImgJp
                        };
                
                        //Tiến hành cập nhật mysql
                        try{
                            await this.entityManager.transaction( async transactionalEntityManager => {
                                //update background
                                transactionalEntityManager.update(About, globalCustomer.id, updateImgGlobal);
                            });
                            this.write_log(request, "Cập nhật hình ảnh global customer")
                            //Sau khi cập nhật mysql thì xóa hình ảnh cũ đi
                            await this.deleteFile(`uploads/about/${globalCustomer.img.split('/').pop()}`);
                            await this.deleteFile(`uploads/about/${globalCustomer.img_jp.split('/').pop()}`);
                            return await this.getInfoPage();
                        }
                        catch(err) {
                            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                        }
                    }
                    
                }
                else{
                    throw new BadRequestException('ERROR. PLEASE UPLOAD 2 FILES EN , JP', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD 2 FILES EN , JP' });
                }
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async branchOverviewImg(imgs: Array<Express.Multer.File>, request): Promise<any> {
        try{
            if(!imgs){
                throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
            }
            else{
                if(imgs.length === 2){
                    if(imgs[0].size >= 5 * 1024 * 1024 || imgs[1].size >= 5 * 1024 * 1024){
                        await this.deleteFile(imgs[0].path);
                        await this.deleteFile(imgs[1].path);
                        throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                    }
                    else{
                        //Tìm dữ liệu trước đó của page 1
                        const branchOverview = await this.about.findOne({
                            where: {
                                item: 'branch-overview',
                                describe: 'branch-overview'
                            }
                        })

                        const updateImg = `about/${imgs[0].path}`.replace(/\\/g, '/');
                        const updateImgJp = `about/${imgs[1].path}`.replace(/\\/g, '/');

                        //Khai báo đối tượng background để update
                        const updateImgBranchOverview : any = {
                            img: updateImg,
                            img_jp: updateImgJp
                        };
                
                        //Tiến hành cập nhật mysql
                        try{
                            await this.entityManager.transaction( async transactionalEntityManager => {
                                //update background
                                transactionalEntityManager.update(About, branchOverview.id, updateImgBranchOverview);
                            });
                            this.write_log(request, "Cập nhật hình ảnh branch overview")
                            //Sau khi cập nhật mysql thì xóa hình ảnh cũ đi
                            await this.deleteFile(`uploads/about/${branchOverview.img.split('/').pop()}`);
                            await this.deleteFile(`uploads/about/${branchOverview.img_jp.split('/').pop()}`);
                            return await this.getInfoPage();
                        }
                        catch(err) {
                            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                        }
                    }
                }
                else{
                    throw new BadRequestException('ERROR. PLEASE UPLOAD 2 FILES EN , JP', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD 2 FILES EN , JP' });
                }
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async branchOverviewCoordinates(body: BranchOverviewListDto, request): Promise<any> {
        try{
            //Tìm dữ liệu trước đó của page 1
            const branchOverview = await this.about.findOne({
                where: {
                    item: 'branch-overview',
                    describe: 'branch-overview'
                }
            })
            
            if(body.language === 'en'){
                const resUpdate = {
                    content: JSON.stringify(body.body) 
                };
                await this.about.update({id: branchOverview.id}, resUpdate);
                this.write_log(request, "Cập nhật tọa độ branch overview english")
            }
            else if(body.language === 'jp'){
                const resUpdate = {
                    content_jp: JSON.stringify(body.body)
                };
                await this.about.update({id: branchOverview.id}, resUpdate);
                this.write_log(request, "Cập nhật tọa độ branch overview japanese")
            }

            return await this.getInfoPage();
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async addBranchOverviewItem(img: Express.Multer.File, body: AddBranchOverview, request): Promise<any> {
        try{
            if(!img){
                throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
            }
            else{
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    for (const key of Object.keys(body)) {
                        try {
                            body[key] = JSON.parse(body[key]);
                        } catch (error) {
                          body[key] = body[key];
                        }
                    }
                    
                    const addImg = `about/${img.path}`.replace(/\\/g, '/');
                    const addBranchOverview = {
                        item: 'branch-overview',
                        describe: body.describe,
                        content: JSON.stringify(body.content),
                        content_jp: JSON.stringify(body.content_jp),
                        img: addImg,
                        img_jp: addImg
                    }
                    await this.about.save(addBranchOverview);
                    this.write_log(request, "Add thêm item branch")
                }
            }
            return await this.getInfoPage();
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async editBranchOverviewItem(img: Express.Multer.File, body: EditBranchOverview, request): Promise<any> {
        try{
            const branOverviewItem = await this.about.findOne({
                where: {
                    id: body.id
                }
            })

            if(img){
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    await this.deleteFile(`uploads/about/${branOverviewItem.img.split('/').pop()}`);
                    const updateImg = `about/${img.path}`.replace(/\\/g, '/');
                    body.img = body.img_jp = updateImg;
                    
                }
            }

            await this.about.update({id: branOverviewItem.id}, body);
            this.write_log(request, `Edit branch item id: ${branOverviewItem.id}`)
            return await this.getInfoPage();
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async delBranchOverviewItem(id: number, request): Promise<any> {
        try{
            const branOverviewItem = await this.about.findOne({
                where: {
                    id: id
                }
            })
            await this.deleteFile(`uploads/about/${branOverviewItem.img.split('/').pop()}`);
            await this.about.remove(branOverviewItem);
            this.write_log(request, `Delete branch item id: ${branOverviewItem.id}`)
            return await this.getInfoPage();
        }
        catch(err) {
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
 