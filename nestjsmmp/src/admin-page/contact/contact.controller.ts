import { HasPermission } from './../../userManagement/permission/has-permission.decorator';
import { AuthGuard } from './../../userManagement/auth/auth.guard';
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactUsDto } from './models/contact-us.dto';
import { ContactInformation } from './models/contact-information.entity';
import { ContactUs } from './models/contact-us.entity';
import { AddContactInfoDto } from './models/add-contact-info.dto';
import { EditContactInfoDto } from './models/edit-contact-info.dto';
import { UpdateContactInfoDto } from './models/contact-info.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
    constructor(
        private contactService: ContactService,
    ){

    }

    @Get('info')
    async getInfo() {
        return await this.contactService.getInfo();
    }

    @Post('contact-us')
    async contactUs(
        @Body() body: ContactUsDto,
    ) {
        return await this.contactService.saveContactUs(body);
    }

    @ApiBody({
        type: UpdateContactInfoDto, examples: {
            body: {
                value: {
                    email: "sales@marueivn.com",
                    phone: "+84 274 3782 133",
                    tel: "+84 274 3782 133",
                    facebook: 'facebook.com',
                    youtube: 'youtube.com',
                }
            }
        }
    })

    @UseGuards(AuthGuard)
    @HasPermission(21)
    @Patch('contact-info')
    async changeContactInfo(
        @Body() body: UpdateContactInfoDto,
    ): Promise<ContactInformation> {
        return await this.contactService.changeContactInfo(body);
    }

    @UseGuards(AuthGuard)
    @HasPermission(13)
    @Get('contact-us-list')
    async getContactUsList(): Promise<ContactUs[]> {
        return await this.contactService.getContactUsList();
    }

    @UseGuards(AuthGuard)
    @HasPermission(21)
    @Post('add-contact-us')
    async addContactUs(
        @Body() body: AddContactInfoDto,
    ): Promise<ContactUs> {
        return await this.contactService.addContactUs(body);
    }

    @UseGuards(AuthGuard)
    @HasPermission(21)
    @Patch('edit-contact-us')
    async editContactUs(
        @Body() body: EditContactInfoDto,
    ): Promise<ContactUs> {
        return await this.contactService.editContactUs(body);
    }

    @UseGuards(AuthGuard)
    @HasPermission(21)
    @Delete('del-contact-us')
    async delContactUs(
        @Query('id') id: number,
    ): Promise<ContactUs> {
        return await this.contactService.delContactUs(Number(id));
    }
}
