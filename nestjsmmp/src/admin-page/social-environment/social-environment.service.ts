import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Social } from './models/social.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { title } from 'process';
import { ConfigService } from '@nestjs/config';
import { SocialTimeline } from './models/social_timeline.entity';
import { json } from 'stream/consumers';
import * as fs from 'fs';
import { InsertGroupImgDto } from './models/insertGroupImg.dto';
import { UpdateSocialDto } from './models/updateSocial.dto';
import { AddSocialDto } from './models/addSocial.dto';


@Injectable()
export class SocialEnvironmentService {
    constructor(
        @InjectRepository(Social)
        private social: Repository<Social>,

        @InjectRepository(SocialTimeline)
        private socialTimeline: Repository<SocialTimeline>,
        private readonly configService: ConfigService,
    ) { }

    apiUrl = this.configService.get<string>("APIURL");

    async getImageAll() {
        const get_data = await this.social.find({ where: { content_img: Not(IsNull()) } });
        // return get_data;
        const _ = require("lodash");
        const data = _.mapValues(_.groupBy(get_data, 'page'), clist => clist.map(list_content => _.omit(list_content, 'page'))); //group data by page
        const res = {}

        //group data by main_content
        Object.keys(data).forEach(key => { res[key] = _.mapValues(_.groupBy(data[key], 'main_content'), clist => clist.map(list_content => _.omit(list_content, 'main_content'))); })
        // return res;
        const res1 = {}

        //group data by content_img
        Object.keys(res).forEach(key => {
            res1[key] = {}
            Object.keys(res[key]).forEach(key_child => { res1[key][key_child] = _.mapValues(_.groupBy(res[key][key_child], 'content_img'), clist => clist.map(list_content => _.omit(list_content, 'content_img'))); })
        })
        // return res1;
        const data_social = Object.keys(res1).map(key => ({ page: key, data_temp: res1[key] }));
        // return data_social;
        data_social.forEach(val => {
            val['data'] = Object.keys(val['data_temp']).map(key => ({ main_content: key, data_temp: val['data_temp'][key] }));
            delete val['data_temp'];
            val['data'].forEach(ele => {
                ele['data'] = Object.keys(ele['data_temp']).map(key => ({ content_img: key, data_img: ele['data_temp'][key] }));
                delete ele['data_temp'];
                ele['data'].forEach(total => {
                    total['data_img'].forEach(img => {
                        img.images = this.apiUrl + '/' + img.images;
                    })
                })
            })

        });
        return data_social;
        // res_1.forEach(val => {
        //     val['data'].forEach(ele => {
        //         ele.data_img.forEach(img => {
        //             img.images = this.apiUrl + '/' + img.images;
        //         })
        //     })
        // })
        // return res_1;
        // return await this.social.find({where: {page: 'social'}});
    }

    async getSocietyTimeline() {
        const data = await this.socialTimeline.find({ where: { page: "Social" } });
        data.forEach(val => {
            val['data'] = JSON.parse(val.data_img);
            // console.log(val['data']);
            val['data_jp'] = JSON.parse(val.data_img_jp);
            val['data'].forEach(ele => {
                // ele['data'].forEach(img => {
                //     img = this.apiUrl + '/' + img;
                // })
                for (let i = 0; i < ele['data'].length; i++) {
                    ele['data'][i] = this.apiUrl + '/' + ele['data'][i];
                }

            })

            val['data_jp'].forEach(ele => {
                for (let i = 0; i < ele['data'].length; i++) {
                    ele['data'][i] = this.apiUrl + '/' + ele['data'][i];
                }
            })
            delete val.data_img;
            delete val.data_img_jp;
        })
        return data;
    }

    async getOneSocietyTimeline(id: number) {
        const val = await this.socialTimeline.findOneBy({ id });

        val['data'] = JSON.parse(val.data_img);
        // console.log(val['data']);
        val['data_jp'] = JSON.parse(val.data_img_jp);
        val['data'].
        forEach(ele => {
            // ele['data'].forEach(img => {
            //     img = this.apiUrl + '/' + img;
            // })
            for (let i = 0; i < ele['data'].length; i++) {
                ele['data'][i] = this.apiUrl + '/' + ele['data'][i];
            }

        })

        val['data_jp'].forEach(ele => {
            for (let i = 0; i < ele['data'].length; i++) {
                ele['data'][i] = this.apiUrl + '/' + ele['data'][i];
            }
        })
        delete val.data_img;
        delete val.data_img_jp;

        return val;
    }

    async getSocietyTimeline1() {
        const get_data = await this.socialTimeline.find({ where: { timeline: Not(IsNull()) } });
        // return get_data;
        const _ = require("lodash");
        const data = _.mapValues(_.groupBy(get_data, 'main_content'), clist => clist.map(list_content => _.omit(list_content, 'main_content'))); //group data by page
        const res = {}

        //group data by main_content
        Object.keys(data).forEach(key => { res[key] = _.mapValues(_.groupBy(data[key], 'content_img'), clist => clist.map(list_content => _.omit(list_content, 'content_img'))); })
        // return res;



        // return res1;
        const data_social = Object.keys(res).map(key => ({ main_content: key, data_temp: res[key] }));
        // // return data_social;
        data_social.forEach(val => {
            val['data'] = Object.keys(val['data_temp']).map(key => ({ content_img: key, data_temp: val['data_temp'][key] }));
            delete val['data_temp'];
            val['timeline'] = val['data'][0]['data_temp'][0]['timeline']
        })
        //     val['data'] = Object.keys(val['data_temp']).map(key => ({main_content: key, data_temp: val['data_temp'][key]}));
        //     delete val['data_temp'];
        //     val['data'].forEach(ele => {
        //         ele['data'] = Object.keys(ele['data_temp']).map(key => ({content_img: key, data_img: ele['data_temp'][key]}));
        //         delete ele['data_temp'];
        //         ele['data'].forEach(total => {
        //             total['data_img'].forEach(img => {
        //                 img.images = this.apiUrl + '/' + img.images;
        //             })
        //         })
        //     })

        // });
        const data_social_new = data_social.sort((a, b) => {
            if (a['timeline'] > b['timeline']) {
                return -1;
            }
            else {
                return 1;
            }
        })

        data_social_new.forEach(ele => {
            ele['data'].forEach(val => {
                val['data'] = [];
                val['data_temp'].forEach(img => {
                    val['data'].push(this.apiUrl + '/' + img.images);
                })
                delete val['data_temp'];
            })
        })
        return data_social_new;
    }

    async getImgEnvironment() {
        const get_data = await this.socialTimeline.find({ where: { page: "Environment" } });
        // return get_data;
        var link_img = this.apiUrl + '/' + get_data[0]['data_img'];
        var link_img_jp = this.apiUrl + '/' + get_data[0]['data_img_jp'];
        return { img_env: link_img, img_jp: link_img_jp };
    }

    async addImageSocial(id: number, index: number, filename: string) {
        const get_data = await this.socialTimeline.findOneBy({ id });
        let data = JSON.parse(get_data.data_img);
        let data_jp = JSON.parse(get_data.data_img_jp);

        data[index].data.push("social-environment/uploads/social/" + filename);
        data_jp[index].data.push("social-environment/uploads/social/" + filename);
        await this.socialTimeline.update(id, { data_img: JSON.stringify(data), data_img_jp: JSON.stringify(data_jp) });
        return await this.getOneSocietyTimeline(id);
    }

    async deleteImageSocial(id: number, index:number, index_img:number){
        const get_data = await this.socialTimeline.findOneBy({ id });
        let data = JSON.parse(get_data.data_img);
        let data_jp = JSON.parse(get_data.data_img_jp);
        const link = data[index].data[index_img];
        data[index].data.splice(index_img, 1);
        data_jp[index].data.splice(index_img, 1);
        await this.socialTimeline.update(id, { data_img: JSON.stringify(data), data_img_jp: JSON.stringify(data_jp) });
        try {
            await this.deleteFile(`uploads/social/${link.split('/').pop()}`);
        } catch (error) {
            return await this.getOneSocietyTimeline(id);
        }
        return await this.getOneSocietyTimeline(id);
    }

    async deleteFile(filePath: string): Promise<void> {
        try{
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
        catch(err) {
            throw new InternalServerErrorException(err, { cause: new Error(), description: err });
        }
    }

    async deleteGroupImgSocial(id: number, index:number){
        const get_data = await this.socialTimeline.findOneBy({ id });
        let data = JSON.parse(get_data.data_img);
        let data_jp = JSON.parse(get_data.data_img_jp);

        const links = data[index].data;
        data.splice(index, 1);
        data_jp.splice(index, 1);
        await this.socialTimeline.update(id, { data_img: JSON.stringify(data), data_img_jp: JSON.stringify(data_jp) });

        try {
            for(const link of links){
                await this.deleteFile(`uploads/social/${link.split('/').pop()}`);
            }
        } catch (error) {
            return await this.getOneSocietyTimeline(id);
        }
        return await this.getOneSocietyTimeline(id);
    }

    async addGroupImgSocial(data: InsertGroupImgDto){
        const get_data = await this.socialTimeline.findOneBy({ id: data.id });
        let data_en:Array<any> = JSON.parse(get_data.data_img);
        let data_jp:Array<any> = JSON.parse(get_data.data_img_jp);
        // console.log(data_en);
        data_en.push({content_img: data.content_img, data: []});
        data_jp.push({content_img: data.content_img_jp, data: []});

        await this.socialTimeline.update(data.id, { data_img: JSON.stringify(data_en), data_img_jp: JSON.stringify(data_jp) });
        return await this.getOneSocietyTimeline(data.id);
    }

    async updateSocial(data: UpdateSocialDto){
        // try {
            for(let i = 0; i < data.data.length; i++){
                for(let j = 0; j < data.data[i].data.length; j++){
                    const filename = data.data[i].data[j].split('/').pop();
                    data.data[i].data[j] = `social-environment/uploads/social/` + filename;
                }
                
            }
            for(let i = 0; i < data.data.length; i++){
                for(let j = 0; j < data.data_jp[i].data.length; j++){
                    const filename = data.data_jp[i].data[j].split('/').pop();
                    data.data_jp[i].data[j] = `social-environment/uploads/social/` + filename;
                }
                
            }
            data['data_img'] = JSON.stringify(data.data);
            data['data_img_jp'] =  JSON.stringify(data.data_jp);
            delete data.data;
            delete data.data_jp;
            await this.socialTimeline.save(data);
            return await this.getOneSocietyTimeline(data.id);
        // }
        // catch(err){
        //     throw new InternalServerErrorException(err.errno);
        // }
    }

    async addSocial(data: AddSocialDto){
        data['page'] = "Social";
        await this.socialTimeline.save(data);
        return await this.getSocietyTimeline();
    }

    async deleteSocial(id: number){
        const get_one_img = await this.getOneSocietyTimeline(id);
        const list_img = [];
        for(let i = 0; i < get_one_img['data'].length; i++){
            for(let j = 0; j < get_one_img['data'][i]['data'].length; j++){
                list_img.push(get_one_img['data'][i]['data'][j]);
            }
        }
        for(let i = 0; i < get_one_img['data_jp'].length; i++){
            for(let j = 0; j < get_one_img['data_jp'][i]['data'].length; j++){
                list_img.push(get_one_img['data_jp'][i]['data'][j]);
            }
        }
        await this.socialTimeline.delete(id);
        try {
            for(const link of list_img){
                await this.deleteFile(`uploads/social/${link.split('/').pop()}`);
            }
        } catch (error) {
            return await this.getSocietyTimeline();
        }
        
        return await this.getSocietyTimeline();
    }

    async updateImgEnvi(filename: string){
        const get_img = await this.socialTimeline.findOneBy({page: 'Environment'});
        await this.socialTimeline.update(get_img.id, {data_img: `social-environment/uploads/social/` + filename});
        try {
            await this.deleteFile(`uploads/social/${get_img.data_img.split('/').pop()}`);
            
        } catch (error) {
            return await this.getImgEnvironment();
        }
        return await this.getImgEnvironment();
    }
}
