import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jobs } from './models/jobs.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InsertJobDescriptionDto } from './models/insertJobDescription.dto';
import { JobsDescription } from './models/jobs-decription.entity';
import { ConfigService } from '@nestjs/config';
import { CategoryJob } from './models/categoryJob.entity';
import { EmailDto } from './models/email.dto';
import { RecruitmentEmail } from './models/emailRegister.entity';
import { InsertJobDto, InsertTrainGroupDto, UpdateJobDto, UpdateTrainGroupDto } from './models/insertTrainGroup.dto';
import { InsertJobGroupDto, UpdateJobGroupDto, UpdateNewJobDto } from './models/jobDepartment.dto';
import * as fs from 'fs';

@Injectable()
export class RecruitmentService {
    constructor(
        @InjectRepository(CategoryJob) private readonly categoryJob: Repository<CategoryJob>,

        @InjectRepository(Jobs) private readonly jobs: Repository<Jobs>,

        @InjectRepository(JobsDescription) private readonly jobsDescription: Repository<JobsDescription>,

        @InjectRepository(RecruitmentEmail) private readonly recruitmentEmail: Repository<RecruitmentEmail>,

        private readonly configService: ConfigService,
    ){}
    
    apiUrl = this.configService.get<string>("APIURL");
    //get information job
    async findAll(show_inactive: boolean){
        // try {
        const lang = ['vi', 'en', 'jp']
        let get_data
        if(show_inactive){
            get_data = await this.categoryJob.find({relations:['jobs'],
                                                        where:{}
            })
        }
        else{
            get_data = await this.categoryJob.find({relations:['jobs'],
                                                        where:[{jobs:{status:'active'}},
                                                                {jobs: {status:IsNull()}}]
            })
        }
        
        get_data.forEach(category => {
            category['name'] = {}
            lang.forEach(language =>{
                category['name'][language] = category['name_'+language];
                delete category['name_'+language];
            })
            category['jobs'].forEach(job=>{
                job['name'] = {};
                lang.forEach(language =>{
                    job['name'][language] = job['name_'+language];
                    delete job['name_'+language];
                })
                job.pdf_file = this.apiUrl + '/' + job.pdf_file;
                // job['des'] = []
                // var keys = []
                // job['description'].forEach(des => {
                //     if(keys.includes(des['group_description_vi'])==false){
                //         keys.push(des['group_description_vi'])
                //     }
                // })
                // keys.forEach((value,index)=>{
                //     job['des'].push({group:{},detail:{}});
                //     lang.forEach(language=>{
                //         job['des'][index].group[language] = '';
                //         job['des'][index].detail[language] = [];
                //     })
                // })
                
                // job['description'].forEach(des => {
                //     let index = keys.findIndex(item => item === des['group_description_vi']);
                //     if(index>=0){
                //         lang.forEach(language=>{
                //             job['des'][index]['group'][language] = des['group_description_'+language]; 
                //             job['des'][index]['detail'][language].push(des['description_detail_'+language]);
                //         })
                //     }
                // })
                // delete job['description']
            })
        })
        return get_data
        //     const lang = ['vi', 'en', 'jp']
        //     let data = await this.jobs.find({relations:['description'],
        //                            where: {status:'Active'}
        //                         });
        //     var res = [];
        //     // return data
        //     const group_name = ['Position', 'Job_description', 'Requirements','Salary', 'Allowances', 'Expire','Interview_time','Contact','Email'];
        //     data.forEach(job=>{
        //         var obj = {
        //             name: {},
        //         }
        //         group_name.forEach(group=>{
        //             obj[group] = {};
        //             lang.forEach((la)=> {
        //                 obj[group][la] = [];
        //                 obj.name[la] =  la == 'vi' ? job.name : job['name_'+la]
        //             })
        //         })
                
        //         lang.forEach((la)=>{
        //             if (la=='vi'){
        //                 job['description'].forEach(des =>{
        //                     obj[des.group_description][la].push(des.description_detail);
        //                 })
        //             }else{
        //                 job['description'].forEach(des =>{
        //                     obj[des.group_description][la].push(des['description_detail_'+la]);
        //                 })
        //             }
        //         })
        //         // job.description.forEach(des =>{
        //         //     // console.log(des)
                    
        //         //     obj[des.group_description].push(des.description_detail);
        //         // })
        //         res.push(obj);
        //     })
        //     return res;
        // } catch (error) {
        //     throw new InternalServerErrorException(error.errno.toString());
        // }
    }

    // insert new job
    async insertJob(data: InsertJobDto){
        try {
            // console.log(data)
            return await this.jobs.save(data);
        } catch (error) {
            throw new InternalServerErrorException(error.errno.toString());
        }
    }

    async editTrainGroup(data: UpdateJobDto){
        try {
            const cur = await this.jobs.findOneBy({id: data.id});
            await this.jobs.update(data.id,data);
            return cur;
        } catch (error) {
            throw new InternalServerErrorException(error.errno.toString());
        }
    }

    // Thêm bộ phận
    async addGroupJob(data:InsertJobGroupDto){
        try {
            return await this.categoryJob.save({name_vi: data.name.vi, name_en:data.name.vi, name_jp:data.name.vi});
        } catch (error) {
            throw new InternalServerErrorException(error.errno.toString());
        }
    }
    //Sửa tên bộ phận 
    async editNameGroupJob(data:UpdateJobGroupDto){
        try {
            const cur_group = await this.categoryJob.findOneBy({id:data.id});
            await this.categoryJob.update(data.id,{name_vi: data.name.vi});
            return cur_group;
        } catch (error) {
            throw new InternalServerErrorException(error.errno.toString());
        }
    } 

    //Xóa bộ phận 
    async removeGroupJob(id:number){
        try {
            const cur_group = await this.categoryJob.findOneBy({id});
            await this.categoryJob.delete(id);
            return cur_group;
        } catch (error) {
            throw new InternalServerErrorException(error.errno.toString());
        }
    }
    // insert new job
    // async getPathBackground(){
        // try {
        //     let data = await this.jobs.findOne({relations:['description'],
        //         where: {id: 1, description:{group_description:'background'}}
        //     });
        //     data.description[0].description_detail = this.apiUrl + data.description[0].description_detail;
        //     return data.description[0];
        // } catch (error) {
        //     throw new InternalServerErrorException(error.errno.toString());
        // }
    // }

    // Inactive job old
    async inactiveJob(id: number){
        // try {
        //     return this.jobs.update(id, {status: 'Inactive'});
        // } catch (error) {
        //     throw new InternalServerErrorException(error.errno.toString());
        // }
    }

    // Rename job
    async editJob(id: number, data: UpdateJobDto){
        try {
            // console.log(data)
            const job = await this.jobs.findOneBy({id});
            const res = await this.jobs.update(id, data);
            try{
                if(data.pdf_file){
                    await this.deleteFile(`uploads/recruitment/${job.pdf_file.split('/').pop()}`);
                }
            }catch{
                return res;
            }
            return res;
        } catch (error) {
            throw new InternalServerErrorException(error.errno.toString());
        }
    }

    // Delete Job
    async removeJob(id: number){
        try {
            const job = await this.jobs.findOneBy({id});
            await this.jobs.delete(id);
            // xóa file
            try{
                await this.deleteFile(`uploads/recruitment/${job.pdf_file.split('/').pop()}`);
            }catch{
                return job;
            }
            return job;
        } catch (error) {
            // console.log(error)
            throw new InternalServerErrorException(error.errno.toString());
        }
    }
    //Insert description detail
    async insertJobDescription(data:InsertJobDescriptionDto){
    //     const group_name = ['Position', 'Job_description', 'Requirements','Salary', 'Allowances', 'Expire','Interview_time','Contact','Email'];
    //     var data_insert = []
    //     group_name.forEach(group=>{
    //         let sub = data[group].split('\n');
    //         sub.forEach((val)=> { data_insert.push({jobs: data.job_id, group_description: group, description_detail: val})})
    //     })
    //     if (data_insert.length){
    //         this.jobsDescription.createQueryBuilder().insert().values(data_insert).execute();
    //     }
    //     return {message: 'insert complete', data: data_insert};
    }

    async findWelfareTrain(){
        const lang = ['vi','en','jp'];
        let data = await this.jobs.find({relations:[],
                                                where: {category: IsNull()}
        })
        data.forEach(val=>{
            val['name'] = {}
            lang.forEach(language =>{
                val['name'][language] = val['name_' + language];
            })
            val['description'] = JSON.parse(val['pdf_file']);
            // val['description'].forEach(des=>{
            //     des['font'] = des['group_description_vi']
            //     // console.log(des['group_description_vi'])
            //     des['data'] = {}
            //     lang.forEach(language =>{
            //         des['data'][language] = des['description_detail_' + language];
            //         delete des['group_description_'+language]
            //         delete des['description_detail_'+language]
            //     })
            // })
            delete val['name_en']
            delete val['name_vi']
            delete val['name_jp']
            delete val['status']
            delete val['created_at']
            delete val['pdf_file']
        })
        return data;
    //     let data = await this.jobs.findOne({relations:['description'],
    //                                where: {id: 1, description:{group_description: Not('background')}}
    //                             });
    //     const _ = require('lodash');
    //     const group = _.mapValues(_.groupBy(data.description, 'group_description'), clist => clist.map(list_content => _.omit(list_content, 'group_description')));
    //     var res = {title: {'en': group['title'][0]['description_detail_en'],
    //                         'vi': group['title'][0]['description_detail'],
    //                         'jp': group['title'][0]['description_detail_jp'],},
    //             content: {'en':[], 'vi':[], 'jp':[]}, add: {}}
    //     group['content'].forEach(val => {
    //         res.content['vi'].push(val.description_detail);
    //         res.content['en'].push(val.description_detail_en);
    //         res.content['jp'].push(val.description_detail_jp);
    //     })
    //     delete group["title"];
    //     delete group["content"];
    //     // console.log(group)
    //     Object.keys(group).forEach(key=>{
    //         // console.log(key)
    //         res.add[key] = {'en':[], 'vi':[], 'jp':[]};
    //         group[key].forEach(gr => {
    //             // console.log(gr)
    //             res.add[key]['vi'].push(gr.description_detail);
    //             res.add[key]['en'].push(gr.description_detail_en);
    //             res.add[key]['jp'].push(gr.description_detail_jp);
    //         })
    //     })
    //     return res;
    }

    // async updateJobDescription(id: number, description_detail: string){
        // try {
        //     return this.jobsDescription.update(id,{description_detail});
        // } catch (error) {
        //     throw new InternalServerErrorException(error.errno.toString());
        // }
    // }

    // Delete description
    // async removeJobDescription(id: number){
        // try {
        //     return this.jobsDescription.delete(id);
        // } catch (error) {
        //     throw new InternalServerErrorException(error.errno.toString());
        // }
    // }

    // async saveEmail(data: EmailDto){
    //     try {
    //         // console.log(data)
    //         return await this.recruitmentEmail.save(data);
    //     } catch (error) {
    //         if(error.errno == 1062){
    //             throw new ConflictException("Email Existed", { cause: new Error(), description: 'Some error description' })
    //         }else{
    //             throw new InternalServerErrorException(error.errno.toString());
    //         }
    //     }
    // }
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

}
