import { AbstractService } from 'src/userManagement/common/abstract.service';
import { ConflictException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactInformation } from './models/contact-information.entity';
import { Repository } from 'typeorm';
import { ContactUs } from './models/contact-us.entity';
import { UpdateContactInfoDto } from './models/contact-info.dto';
import { AddContactInfoDto } from './models/add-contact-info.dto';
import { EditContactInfoDto } from './models/edit-contact-info.dto';

@Injectable()
export class ContactService extends AbstractService{
    constructor(
        @InjectRepository(ContactInformation) private readonly contactInformation: Repository<ContactInformation>,
        @InjectRepository(ContactUs) private readonly contactUs: Repository<ContactUs>,

       
    ){
        super(contactInformation);
    }

    async getInfo(): Promise<ContactInformation[]> {
        try{
            const result = await super.all();
            return result;
        }
        catch(err) {
            throw new ConflictException(err, { cause: new Error(), description: err });
        }
    }

    async saveContactUs(body): Promise<ContactUs> {
        try{
            const result = await this.contactUs.save(body);
            return result;
        }
        catch(err){
            throw new ConflictException(err, { cause: new Error(), description: err });
        }
    }

    async changeContactInfo(body: UpdateContactInfoDto): Promise<ContactInformation> {
        try{
            await this.contactInformation.update({id: 1}, body);
            return await super.findOne({id: 1});
        }
        catch(err){
            throw new ConflictException(err, { cause: new Error(), description: err });
        }
    }

    async getContactUsList(): Promise<ContactUs[]> {
        try{
            return await this.contactUs.find();
        }
        catch(err) {
            throw new ConflictException(err, { cause: new Error(), description: err });
        }
    }

    async addContactUs(body: AddContactInfoDto): Promise<ContactUs> {
        try{
            return await this.contactUs.save(body);
        }
        catch(err) {
            throw new ConflictException(err, { cause: new Error(), description: err });
        }
    }

    async editContactUs(body: EditContactInfoDto): Promise<ContactUs> {
        try{
            const editContactUs = await this.contactUs.findOne({
                where: {id: body.id}
            })
            if (!editContactUs) {
                // Handle the case where the entity with the given ID doesn't exist
                throw new ConflictException('ERROR. CONTACT NOT FOUND', { cause: new Error(), description: 'ERROR. CONTACT NOT FOUND' });
            }
            await this.contactUs.update({id: body.id}, body);

            return this.contactUs.findOne({
                where: {id: body.id}
            })
        }
        catch(err) {
            throw new ConflictException(err, { cause: new Error(), description: err });
        }
    }

    async delContactUs(id: number): Promise<ContactUs> {
        try{
            const deletedContactUs = await this.contactUs.findOne({
                where: {id: id}
            })
            if (!deletedContactUs) {
                // Handle the case where the entity with the given ID doesn't exist
                throw new ConflictException('ERROR. CONTACT NOT FOUND', { cause: new Error(), description: 'ERROR. CONTACT NOT FOUND' });
            }
            await this.contactUs.delete(id);
            return deletedContactUs;
        }
        catch(err) {
            throw new ConflictException(err, { cause: new Error(), description: err });
        }
    }
}
