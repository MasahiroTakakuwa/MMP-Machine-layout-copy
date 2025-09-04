import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '../service/product.service';
import { DepartmentService } from '../../services/department.service';
import { IDepartment, IRolePermission } from '../../interface/permission';
import { MessageModule } from 'primeng/message';
import { PositionService } from '../../services/position.service';
import { RoleService } from '../../services/role.service';
import { Chip } from 'primeng/chip';
import { PermissionService } from '../../services/permission.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from '../../services/users.service';
import { IUser, IUserManagement } from '../../interface/user';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface DepartmentsPositions {
    id: number;
    name: string;
    description: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-account-management',
    standalone: true,
    imports: [
        CommonModule, 
        TabsModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        MessageModule,
        InputTextModule,
        AutoCompleteModule,
        Chip
    ],
    providers: [DepartmentService, RoleService, UsersService],
    template: `
        <p-toast />
        <p-confirmdialog [style]="{ width: '450px' }"></p-confirmdialog>
        <div class="card">
            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Account Management</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p-toolbar styleClass="mb-6">
                            <ng-template #start>
                                <!-- <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNewUser()" /> -->
                            </ng-template>

                            <ng-template #end>
                                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                            </ng-template>
                        </p-toolbar>

                        <p-table
                            #dtUsers
                            [value]="users()"
                            [rows]="10"
                            [columns]="cols"
                            [paginator]="true"
                            [globalFilterFields]="['name', 'description']"
                            [tableStyle]="{ 'min-width': '75rem' }"
                            [rowHover]="true"
                            dataKey="id"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} departments"
                            [showCurrentPageReport]="true"
                            [rowsPerPageOptions]="[10, 20, 30]"
                        >
                            <ng-template #caption>
                                <div class="flex items-center justify-between">
                                    <!-- <h5 class="m-0">Manage Departments</h5> -->
                                    <p-iconfield>
                                        <p-inputicon styleClass="pi pi-search" />
                                        <input pInputText type="text" (input)="onGlobalFilter($event, dtUsers)" placeholder="Search..." />
                                    </p-iconfield>
                                </div>
                            </ng-template>
                            <ng-template #header>
                                <tr>
                                    <th style="min-width: 5rem">Id</th>
                                    <th pSortableColumn="username" style="min-width:16rem">
                                        Username
                                        <p-sortIcon field="username" />
                                    </th>
                                
                                    <th pSortableColumn="firstname" style="min-width: 8rem">
                                        Firstname
                                        <p-sortIcon field="firstname" />
                                    </th>
                                    <th pSortableColumn="lastname" style="min-width: 8rem">
                                        Lastname
                                        <p-sortIcon field="lastname" />
                                    </th>
                                    <th pSortableColumn="email" style="min-width: 8rem">
                                        Email
                                        <p-sortIcon field="email" />
                                    </th>
                                    <th pSortableColumn="status" style="min-width: 8rem">
                                        Status
                                        <p-sortIcon field="status" />
                                    </th>
                                    <th pSortableColumn="phoneNumber" style="min-width: 8rem">
                                        Phone Number
                                        <p-sortIcon field="phoneNumber" />
                                    </th>
                                    <th pSortableColumn="avatar" style="min-width: 8rem">
                                        Avatar
                                        <p-sortIcon field="avatar" />
                                    </th>
                                    <th pSortableColumn="department" style="min-width: 8rem">
                                        Department
                                        <p-sortIcon field="department" />
                                    </th>
                                    <th pSortableColumn="position" style="min-width: 8rem">
                                        Position
                                        <p-sortIcon field="position" />
                                    </th>
                                    <th pSortableColumn="roles" style="min-width: 8rem">
                                        Roles
                                        <p-sortIcon field="roles" />
                                    </th>
                                    <th pSortableColumn="CreatedAt" style="min-width: 8rem">
                                        Created At
                                        <p-sortIcon field="CreatedAt" />
                                    </th>
                                    <th style="min-width: 12rem"></th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-user>
                                <tr>
                                    <td>{{ user.id }}</td>
                                    <td>{{ user.user_name }}</td>
                                    <td>{{ user.first_name }}</td>
                                    <td>{{ user.last_name }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.status }}</td>
                                    <td>{{ user.phone_number }}</td>
                                    <td>
                                        <img *ngIf="user.avatar; else noAvatar" 
                                            [src]="user.avatar" 
                                            alt="avatar" width="40" height="40" 
                                            style="border-radius: 50%;" />
                                        <ng-template #noAvatar>
                                            <span class="pi pi-user" style="font-size: 1.5rem; color: gray;"></span>
                                        </ng-template>
                                    </td>
                                    <td>{{ user.department?.name || '-' }}</td>
                                    <td>{{ user.position?.name || '-' }}</td>
                                    <td>
                                        <ng-container *ngIf="user.roles?.length > 0; else noRole">
                                            <ng-container *ngFor="let role of user.roles; let last = last">
                                                {{ role.name }}<span *ngIf="!last">, </span>
                                            </ng-container>
                                        </ng-container>
                                        <ng-template #noRole>-</ng-template>
                                    </td>
                                    <td>{{ user.created_at | date:'dd/MM/yyyy HH:mm:ss' }}</td>
                                    <td>
                                        <!-- <p-button icon="pi pi-pencil" class="mr-2"
                                                [rounded]="true" [outlined]="true"
                                                (click)="editUser(user)" />
                                        <p-button icon="pi pi-trash" severity="danger"
                                                [rounded]="true" [outlined]="true"
                                                (click)="deleteUser(user)" /> -->
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>

                        <p-dialog [(visible)]="userDialog" [style]="{ width: '450px' }" header="Account Details" [modal]="true">
                            <ng-template #content>
                                <div class="flex flex-col gap-6">
                                    <div>
                                        <label for="name" class="block font-bold mb-3">Name</label>
                                        <input type="text" pInputText id="name" [(ngModel)]="user.user_name" required autofocus fluid />
                                        <small class="text-red-500" *ngIf="submittedUser && !user.user_name">Name is required.</small>
                                    </div>
                                    <div>
                                        <label for="description" class="block font-bold mb-3">Description</label>
                                        <textarea id="description" pTextarea [(ngModel)]="user.status" required rows="3" cols="20" fluid></textarea>
                                    </div>
                                </div>
                            </ng-template>

                            <ng-template #footer>
                                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogUser()" />
                                <!-- <p-button label="Save" icon="pi pi-check" (click)="saveDepartment()" /> -->
                                
                            </ng-template>
                        </p-dialog>

                        <!-- <p-confirmdialog [style]="{ width: '450px' }" /> -->
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
    

})
export class AccountManagement implements OnInit {
    userDialog: boolean = false;

    users = signal<IUserManagement[]>([]);

    user!: IUserManagement;

    autoFilteredValue: IRolePermission[] = [];

    permission!: IRolePermission;

    selectedProducts!: Product[] | null;

    submittedUser: boolean = false;

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private usersService: UsersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadUser();
    }

    loadUser() {
         
        this.usersService.getUsers$().subscribe((data: IUserManagement[]) => {
            this.users.set(data);
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'user_name', header: 'Username' },
            { field: 'first_name', header: 'Firstname' },
            { field: 'last_name', header: 'Lastname' },
            { field: 'email', header: 'Email' },
            { field: 'status', header: 'status' },
            { field: 'phone_number', header: 'Phone Number' },
            { field: 'avatar', header: 'Avatar' },
            { field: 'department', header: 'Department' },
            { field: 'position', header: 'Position' },
            { field: 'roles', header: 'Roles' },
            { field: 'created_at', header: 'Created At' },

        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }


    onGlobalFilter(event: any, table: Table) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    // openNewUser() {
    //     this.user = {
    //         id: null,
    //         name: "",
    //         description: ""
    //     };

    //     this.submittedUser = false;
    //     this.userDialog = true;
    // }


    // editUser(user: IUser) {
    //     this.user = { ...user };
    //     this.userDialog = true;
    // }


    hideDialogUser() {
        this.userDialog = false;
        this.submittedUser = false;
    }


    deleteUser(user: IUser) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.user_name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usersService.deleteUserById$(Number(user.id)).subscribe((res)=> {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Department Deleted',
                        // life: 3000
                    });
                this.loadUser()
                })
                
            }
        });
    }

    // findIndexById(id: string): number {
    //     let index = -1;
    //     for (let i = 0; i < this.users().length; i++) {
    //         if (this.users()[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    // }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }

    // saveDepartment() {
    //     this.submittedUser = true;
    //     let _users = this.users();
    //     if (this.user.user_name?.trim()) {
    //         if (this.user.id) {
    //             this.usersService.updateUserById$(this.user).subscribe((res) => {
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Department Updated',
    //                     life: 3000
    //                 });
    //                 this.loadUser()
    //             })
                
    //         } else {
    //             this.usersService.addUser$(this.user).subscribe((res) => {
    //                 this.messageService.add({
    //                     severity: 'success',
    //                     summary: 'Successful',
    //                     detail: 'Department Created',
    //                     life: 3000
    //                 });
    //                 this.loadUser()
    //             })
    //         }

    //         this.userDialog = false;
    //         this.user = {
    //             id: null,
    //             name: "",
    //             description: ""
    //         };
    //     }
    // }

}