import { Repository } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaginatedResult } from './paginated-result.interface';
import * as fs from 'fs';
@Injectable()
export abstract class AbstractService {

    protected constructor(
        protected readonly repository: Repository<any>
    ){}

    async all( relations = []): Promise<any[]> {
        try{
            return await this.repository.find({relations});
        }
        catch(err){
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code });
        }
        
    }

    async paginate(page = 1, relations = []): Promise<PaginatedResult> {
        const take = 15;

        const [data, total] = await this.repository.findAndCount({
            take, 
            skip: (page - 1) * take,
            relations
        });

        return {
            data: data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        }
    }

    async create(data): Promise<any> {
        try{
            return await this.repository.save(data);
        }
        catch(err){
            // console.log(err);
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code });
        }
        
    }

    async find(condition, relations = []): Promise<any> {
        
        try{
            return await this.repository.find({where: condition, relations});
        }
        catch(err){
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code });
        }
    }

    async findOne(condition, relations = []): Promise<any> {
        
        try{
            return await this.repository.findOne({where: condition, relations});
        }
        catch(err){
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code });
        }
    }

    async update(id: number, data): Promise<any> {
        
        try{
            return await this.repository.update(id, data);
        }
        catch(err){
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code });
        }
    }

    async delete(id: number): Promise<any>{
        try{
            return await this.repository.delete(id);
        }
        catch(err){
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code });
        }
        
    }

    async queryPermission(roleId, departmentId){
        try{
            return await this.repository.query(`
            SELECT permissionTable.id, permissionTable.permissionId, permissions.name AS permissionName, permissions.describe AS permissionDescribe
                FROM (SELECT id, permissionId FROM role_department_permission WHERE roleId = ${roleId.roleId} AND departmentId = ${departmentId.departmentId}) AS permissionTable
                INNER JOIN permissions
                ON permissionId = permissions.id
            ;`)
        }
        catch(err){
            throw new InternalServerErrorException(err.errno.toString(), { cause: new Error(), description: err.code });
        }
        
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
}
