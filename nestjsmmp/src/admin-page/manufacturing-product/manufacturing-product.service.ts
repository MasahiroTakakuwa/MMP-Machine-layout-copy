import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Injectable, InternalServerErrorException, BadRequestException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/userManagement/common/abstract.service';
import { ManufacturingProductItem } from './models/manufacturing-product-item.entity';
import { EntityManager, Repository } from 'typeorm';
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


@Injectable()
export class ManufacturingProductService extends AbstractService{
    constructor(
        @InjectRepository(ManufacturingProductItem) private readonly manufacturingProductItem: Repository<ManufacturingProductItem>,

        private readonly configService: ConfigService,
        private readonly entityManager: EntityManager
    ){
        super(manufacturingProductItem);
    }

    apiUrl = this.configService.get<string>("APIURL");

    async containsBraces(inputString) {
        const regex = /[{}]/;
        return regex.test(inputString);
    }

    async getInfoPage(page: number): Promise<void> {
        try{
            const result = await super.find({manufacturing_product: {id: page}}, ['manufacturing_product']);
            result.forEach( async (manufacturingProductItem) => {
                //Kiểm tra nội dung content
                if(manufacturingProductItem.content){
                    const checkContent = await this.containsBraces(manufacturingProductItem.content)
                    if(checkContent === true){
                        manufacturingProductItem.content = JSON.parse(manufacturingProductItem.content);
                        if(page === 5){
                            let subContent ='';
                            manufacturingProductItem.content.map(contentItem => {
                                if(contentItem.title === 'pr'){
                                    subContent = contentItem.content;
                                    delete manufacturingProductItem.content[contentItem];
                                }
                            });
                            manufacturingProductItem.content = manufacturingProductItem.content.filter(item => item.title !== 'pr');
                            manufacturingProductItem.sub_content = subContent;
                        }
                    }
                }
                //Kiểm tra nội dung content_jp
                if(manufacturingProductItem.content_jp){
                    const checkContentJp = await this.containsBraces(manufacturingProductItem.content_jp)
                    if(checkContentJp === true){
                        manufacturingProductItem.content_jp = JSON.parse(manufacturingProductItem.content_jp);
                        if(page === 5){
                            let subContentJp ='';
                            manufacturingProductItem.content_jp.map(contentItemJp => {
                                if(contentItemJp.title === 'pr'){
                                    subContentJp = contentItemJp.content;
                                    delete manufacturingProductItem.content[contentItemJp];
                                }
                            });
                            manufacturingProductItem.content_jp = manufacturingProductItem.content_jp.filter(itemJp => itemJp.title !== 'pr');
                            manufacturingProductItem.sub_content_jp = subContentJp;
                        }
                    }
                }
                //Kiểm tra nội dung describe
                if(manufacturingProductItem.describe){
                    const checkDescribe = await this.containsBraces(manufacturingProductItem.describe)
                    if(checkDescribe === true){
                        manufacturingProductItem.describe = JSON.parse(manufacturingProductItem.describe);
                    }
                }

                if(manufacturingProductItem.img){
                    manufacturingProductItem.img = this.apiUrl + '/' + manufacturingProductItem.img;
                }
                if(manufacturingProductItem.img_jp){
                    manufacturingProductItem.img_jp = this.apiUrl + '/' + manufacturingProductItem.img_jp;
                }
            })
            return result;
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    
    async updateBackgroundProductOverall( img: Express.Multer.File,  body: MvpProductsOverallDto, request: Request): Promise<any> {
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
                    //xử lý body
                    for (const key of Object.keys(body)) {
                        try {
                            body[key] = JSON.parse(body[key]);
                        } catch (error) {
                        body[key] = body[key];
                        }
                    }

                    //Tìm dữ liệu trước đó của page 1
                    const productOverall : any = await this.manufacturingProductItem.findOne({
                        where: {
                            id: body.id
                        },
                    });
                    
                    //Tạo tên mới cho hình
                    const updateImg = `manufacturing-product/${img.path}`.replace(/\\/g, '/');
                    
                    //Khai báo đối tượng background để update overall
                    let updateBackground: any = {};
                    //Xử lý hình ảnh
                    if(body.lang === 'en'){
                        updateBackground = {
                            img: updateImg
                        };
                    }
                    else{
                        updateBackground = {
                            img_jp: updateImg
                        };
                    }

                    //Tiến hành cập nhật mysql
                    try{
                        await this.entityManager.transaction( async transactionalEntityManager => {
                            //update background
                            transactionalEntityManager.update(ManufacturingProductItem, productOverall.id, updateBackground);
                        });
                    }
                    catch(err) {
                        throw new InternalServerErrorException(err, { cause: new Error(), description: err });
                    }
                    
                    //Xử lý hình ảnh cũ
                    if(body.lang === 'en'){
                        //Xóa hình ảnh cũ đi
                        if(productOverall.img){
                            await this.deleteFile(`uploads/manufacturing-product/${productOverall.img.split('/').pop()}`);
                        }
                        
                    }
                    else{
                        //Xóa hình ảnh cũ đi
                        if(productOverall.img_jp){
                            await this.deleteFile(`uploads/manufacturing-product/${productOverall.img_jp.split('/').pop()}`);
                        }
                    }

                    return await this.getInfoPage(body.page);
                }
                
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async updateContentProductOverall( body: MvpProductsOverallContentDto, request: Request): Promise<any> {
        try{
            //Tìm dữ liệu trước đó của page 1
            const productOverallContent : any = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                },
            }); 
            let updateData: any = {};
            if(body.lang === 'en'){
                if(body.content){
                    updateData.content = body.content;
                }
                else{
                    updateData.content = '';
                }
            }   
            else{
                if(body.content){
                    updateData.content_jp = body.content;
                }
                else{
                    updateData.content_jp = '';
                }
            }  
            //Tiến hành cập nhật mysql
            await this.entityManager.transaction( async transactionalEntityManager => {
                //update background
                transactionalEntityManager.update(ManufacturingProductItem, productOverallContent.id, updateData);
            });
            return await this.getInfoPage(body.page);       
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async mvpProductsOverallCoordinates(body: MvpProductsOverallXYListDto): Promise<any> {
        try{
            //Tìm dữ liệu trước đó của page 1
            const mvpProductsOverallCoordinates = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            })
            let resUpdate: any = {};
            if(body.lang === 'en'){
                resUpdate = {
                    content: JSON.stringify(body.body) 
                };
            }
            else{
                resUpdate = {
                    content_jp: JSON.stringify(body.body)
                };
            }

            await this.manufacturingProductItem.update({id: mvpProductsOverallCoordinates.id}, resUpdate);
            return await this.getInfoPage(body.page);
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async changeManufacturingMethodItem(img: Express.Multer.File, body: ManufacturingMethod): Promise<any> {
        try{
            //xử lý img
            if(!img){
                throw new BadRequestException('EMPTY FILE', { cause: new Error(), description: 'EMPTY FILE' });
            }
            else{
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    //xử lý body
                    for (const key of Object.keys(body)) {
                        try {
                            body[key] = JSON.parse(body[key]);
                        } catch (error) {
                        body[key] = body[key];
                        }
                    }
                    const manufacturingMethod = await this.manufacturingProductItem.findOne({
                        where: {
                            id: body.id
                        }
                    })
        
                    let updateContent: any = {};
                    
                    //tạo đường dẫn file
                    const updateImg = `manufacturing-product/${img.path}`.replace(/\\/g, '/');

                    // Xử lý hình ảnh
                    if(body.lang === 'en'){
                        updateContent = {
                            img: updateImg
                        };
                    }else{
                        updateContent = {
                            img_jp: updateImg
                        };
                    }
                    
                    //Tiến hành cập nhật mysql
                    await this.entityManager.transaction( async transactionalEntityManager => {
                        //update background
                        transactionalEntityManager.update(ManufacturingProductItem, manufacturingMethod.id, updateContent);
                    });
                    //Xử lý hình ảnh cũ
                    if(body.lang === 'en'){
                        //Xóa hình ảnh cũ đi
                        if(manufacturingMethod.img){
                            await this.deleteFile(`uploads/manufacturing-product/${manufacturingMethod.img.split('/').pop()}`);
                        }
                    }
                    else{
                        //Xóa hình ảnh cũ đi
                        if(manufacturingMethod.img_jp){
                            await this.deleteFile(`uploads/manufacturing-product/${manufacturingMethod.img_jp.split('/').pop()}`);
                        }
                    }
                    return await this.getInfoPage(body.page);
                    
                }
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async manufacturingMethodItemContent( body: ManufacturingMethodItemContentDto, request: Request): Promise<any> {
        try{
            //Tìm dữ liệu trước đó
            const productOverallContent : any = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                },
            }); 
            let updateData: any = {};
            if(body.lang === 'en'){
                if(body.content){
                    updateData.content = body.content;
                }
                else{
                    updateData.content = '';
                }
            }
            else{
                if(body.content){
                    updateData.content_jp = body.content;
                }
                else{
                    updateData.content_jp = '';
                }
            }
            //Tiến hành cập nhật mysql
            await this.entityManager.transaction( async transactionalEntityManager => {
                //update background
                transactionalEntityManager.update(ManufacturingProductItem, productOverallContent.id, updateData);
            });
            return await this.getInfoPage(body.page);       
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async addResponseCapacityItem(img: Express.Multer.File, body: AddResponseCapacityItem): Promise<any> {
        try{
            //xử lý img
            if(img){
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    const updateImg = `manufacturing-product/${img.path}`.replace(/\\/g, '/');
                    let createResponseCapacityItem: any = {};
                    //xử lý body
                    for (const key of Object.keys(body)) {
                        try {
                            body[key] = JSON.parse(body[key]);
                        } catch (error) {
                            body[key] = body[key];
                        }
                    }
                    const describeAdd = {
                        en: body.describe,
                        jp: body.describe_jp
                    };
                    createResponseCapacityItem.manufacturing_product = body.page;
                    createResponseCapacityItem.item = 'response-capacity';

                    createResponseCapacityItem.describe = JSON.stringify(describeAdd);
                    createResponseCapacityItem.content = body.content;
                    createResponseCapacityItem.content_jp = body.content_jp;
                    //update img
                    createResponseCapacityItem.img = updateImg;
                    createResponseCapacityItem.img_jp = updateImg;

                    // create CSDL
                    try{
                        await this.manufacturingProductItem.save(createResponseCapacityItem);
                    }
                    catch (err) {
                        throw new UnsupportedMediaTypeException(err, { cause: new Error(), description: 'ERR, CAN NOT UPDATED IMG' });
                    }
                    return await this.getInfoPage(body.page);
                }
            }
            else{
                throw new BadRequestException('ERROR. PLEASE UPLOAD IMG', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD IMG' });
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async editResponseCapacityItem(img: Express.Multer.File, body: EditResponseCapacityItemImgDto): Promise<any> {
        try{
            //xử lý img
            if(img){
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    const responseCapacityItem = await this.manufacturingProductItem.findOne({
                        where: {
                            id: body.id
                        }
                    });
                    let editResponseCapacityItemBody: any = {};
                    const updateImg = `manufacturing-product/${img.path}`.replace(/\\/g, '/');
                    //update img
                    editResponseCapacityItemBody.img = updateImg;
                    editResponseCapacityItemBody.img_jp = updateImg;
                    // update CSDL
                    await this.manufacturingProductItem.update(responseCapacityItem.id, editResponseCapacityItemBody);

                    // delete old img
                    if(responseCapacityItem.img){
                        await this.deleteFile(`uploads/manufacturing-product/${responseCapacityItem.img.split('/').pop()}`);
                    }
                    return await this.getInfoPage(body.page);
                }
            }
            else{
                throw new BadRequestException('ERROR. PLEASE UPLOAD IMG', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD IMG' });
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
    async editResponseCapacityItemContent(body: EditResponseCapacityItemContentDto): Promise<any> {
        try{
            const responseCapacityItem = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            });
            let updateResponseCapacityItem : any = {};

            if(body.content){
                updateResponseCapacityItem.content = body.content;
            }

            if(body.content_jp){
                updateResponseCapacityItem.content_jp = body.content_jp;
            }

            let updateDescribe :any = {};
            if(body.describe){
                updateDescribe.en = body.describe;
            }

            if(body.describe_jp){
                updateDescribe.jp = body.describe_jp;
            }

            if(body.describe || body.describe_jp){
                updateResponseCapacityItem.describe = JSON.stringify(updateDescribe);
            }            
            // update CSDL
            await this.manufacturingProductItem.update(responseCapacityItem.id, updateResponseCapacityItem);
            return await this.getInfoPage(body.page);
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async delResponseCapacityItem(body: DelResponseCapacityItemContentDto): Promise<any> {

        try{
            const delInfo = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            });
    
            if(delInfo){
                //Xóa hình ảnh cũ đi
                if(delInfo.img){
                    await this.deleteFile(`uploads/manufacturing-product/${delInfo.img.split('/').pop()}`);
                }
                await this.manufacturingProductItem.remove(delInfo);
                return await this.getInfoPage(body.page);
            }
            else{
                throw new UnsupportedMediaTypeException('ERROR, NOT FOUND', { cause: new Error(), description: 'ERROR, NOT FOUND' });
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async materialItem(body: AddMMaterialItemDtoList): Promise<any> {
        try{
            const materialItem = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            });
            let addMaterialItemBody: any = {}
            if(body.lang === 'en'){
                addMaterialItemBody.content= JSON.stringify(body.body);
            }
            else{
                addMaterialItemBody.content_jp= JSON.stringify(body.body);
            }
            
            await this.manufacturingProductItem.update(materialItem.id, addMaterialItemBody);
            return await this.getInfoPage(body.page); 
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async treatmentItem(body: AddTreatmentItemDtoList): Promise<any> {
        try{
            const treatmentItem = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            });

            let addTreatmentItemBody: any = {}

            if(body.lang === 'en'){
                addTreatmentItemBody.content = JSON.stringify(body.body)
            }
            else{
                addTreatmentItemBody.content_jp = JSON.stringify(body.body)
            }

            await this.manufacturingProductItem.update(treatmentItem.id, addTreatmentItemBody);
            return await this.getInfoPage(body.page);
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async researchDevelopment(body: ResearchDevelopmentDto): Promise<any> {
        try{
            const researchDevelopment = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            });
            let researchDevelopmentBody: any = {}
            if(body.lang === 'en'){
                researchDevelopmentBody.content = body.content
            }
            else{
                researchDevelopmentBody.content_jp = body.content
            }
            await this.manufacturingProductItem.update(researchDevelopment.id, researchDevelopmentBody);
            return await this.getInfoPage(body.page);
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async addResearchDevelopment(img: Express.Multer.File, body: any): Promise<any> {
        try{
            //xử lý img
            if(img){
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    const updateImg = `manufacturing-product/${img.path}`.replace(/\\/g, '/');
                    let addResearchDevelopmentItem: any = {};
                    
                    const updateDescribe = {
                        en: body.describe,
                        jp: body.describe_jp
                    }
                    addResearchDevelopmentItem.manufacturing_product = body.page;
                    addResearchDevelopmentItem.item = 'machine-item';
                    addResearchDevelopmentItem.describe = JSON.stringify(updateDescribe);
                    addResearchDevelopmentItem.content = JSON.stringify(body.body);
                    addResearchDevelopmentItem.content_jp = JSON.stringify(body.body_jp);
                    //update img
                    addResearchDevelopmentItem.img = updateImg;
                    addResearchDevelopmentItem.img_jp = updateImg;
                    // create CSDL
                    try{
                        await this.manufacturingProductItem.save(addResearchDevelopmentItem);
                    }
                    catch (err) {
                        throw new UnsupportedMediaTypeException(err, { cause: new Error(), description: 'ERR, CAN NOT UPDATED IMG' });
                    }
                    return await this.getInfoPage(body.page);
                }
            }
            else{
                throw new BadRequestException('ERROR. PLEASE UPLOAD IMG', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD IMG' });
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async editResearchDevelopment(img: Express.Multer.File, body: EditResearchDevelopmentItemDto): Promise<any> {
        try{
            //xử lý img
            if(img){
                if(img.size >= 5 * 1024 * 1024){
                    await this.deleteFile(img.path);
                    throw new UnsupportedMediaTypeException('ONLY FILE UNDER 5MB ARE ACCEPTED', { cause: new Error(), description: 'ONLY FILE UNDER 5MB ARE ACCEPTED' });
                }
                else{
                    //xử lý body
                    for (const key of Object.keys(body)) {
                        try {
                            body[key] = JSON.parse(body[key]);
                        } catch (error) {
                            body[key] = body[key];
                        }
                    }
                    const researchDevelopment = await this.manufacturingProductItem.findOne({
                        where: {
                            id: body.id
                        }
                    });

                    let editResearchDevelopmentBody: any = {};
                    const updateImg = `manufacturing-product/${img.path}`.replace(/\\/g, '/');
                    //update img
                    editResearchDevelopmentBody.img = updateImg;
                    editResearchDevelopmentBody.img_jp = updateImg;
                    // update CSDL
                    await this.manufacturingProductItem.update(researchDevelopment.id, editResearchDevelopmentBody);

                    // delete old img
                    if(researchDevelopment.img){
                        await this.deleteFile(`uploads/manufacturing-product/${researchDevelopment.img.split('/').pop()}`);
                    }
                    return await this.getInfoPage(body.page);
                }
            }
            else{
                throw new BadRequestException('ERROR. PLEASE UPLOAD IMG', { cause: new Error(), description: 'ERROR. PLEASE UPLOAD IMG' });
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async editResearchDevelopmentContent(body: EditResearchDevelopmentItemContentDto): Promise<any> {
        try{

            //xử lý body
            for (const key of Object.keys(body)) {
                try {
                    body[key] = JSON.parse(body[key]);
                } catch (error) {
                    body[key] = body[key];
                }
            }

            const editResearchDevelopmentContentData = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            });
            let updateResearchDevelopmentContentData : any = {};

            if(body.content){
                updateResearchDevelopmentContentData.content = JSON.stringify(body.content);
            }

            if(body.content_jp){
                updateResearchDevelopmentContentData.content_jp = JSON.stringify(body.content_jp);
            }

            let updateDescribe :any = {};
            if(body.describe){
                updateDescribe.en = body.describe;
            }

            if(body.describe_jp){
                updateDescribe.jp = body.describe_jp;
            }

            if(body.describe || body.describe_jp){
                updateResearchDevelopmentContentData.describe = JSON.stringify(updateDescribe);
            }            
            // update CSDL
            await this.manufacturingProductItem.update(editResearchDevelopmentContentData.id, updateResearchDevelopmentContentData);
            return await this.getInfoPage(body.page);
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async delResearchDevelopmentContent(body: DelResearchDevelopmentContentDto): Promise<any> {

        try{
            const delInfo = await this.manufacturingProductItem.findOne({
                where: {
                    id: body.id
                }
            });
    
            if(delInfo){
                //Xóa hình ảnh cũ đi
                if(delInfo.img){
                    await this.deleteFile(`uploads/manufacturing-product/${delInfo.img.split('/').pop()}`);
                }
                await this.manufacturingProductItem.remove(delInfo);
                return await this.getInfoPage(body.page);
            }
            else{
                throw new UnsupportedMediaTypeException('ERROR, NOT FOUND', { cause: new Error(), description: 'ERROR, NOT FOUND' });
            }
        }
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }
}
