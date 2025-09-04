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
    selector: 'app-general-information',
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
    providers: [DepartmentService, PositionService, RoleService, PermissionService],
    template: `
        <p-toast />
        <p-confirmdialog [style]="{ width: '450px' }"></p-confirmdialog>
        <div class="card">
            <p-tabs value="0">
                <p-tablist>
                    <p-tab value="0">Departments</p-tab>
                    <p-tab value="1">Positions</p-tab>
                    <p-tab value="2">Roles</p-tab>
                    <p-tab value="3">Permissions</p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <p-toolbar styleClass="mb-6">
                            <ng-template #start>
                                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNewDepartment()" />
                            </ng-template>

                            <ng-template #end>
                                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                            </ng-template>
                        </p-toolbar>

                        <p-table
                            #dtDepartments
                            [value]="departments()"
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
                                    <h5 class="m-0">Manage Departments</h5>
                                    <p-iconfield>
                                        <p-inputicon styleClass="pi pi-search" />
                                        <input pInputText type="text" (input)="onGlobalFilter($event, dtDepartments)" placeholder="Search..." />
                                    </p-iconfield>
                                </div>
                            </ng-template>
                            <ng-template #header>
                                <tr>
                                    <th style="min-width: 16rem">Id</th>
                                    <th pSortableColumn="name" style="min-width:16rem">
                                        Name
                                        <p-sortIcon field="name" />
                                    </th>
                                
                                    <th pSortableColumn="description" style="min-width: 8rem">
                                        Description
                                        <p-sortIcon field="description" />
                                    </th>
                                    
                                    <th style="min-width: 12rem"></th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-department>
                                <tr>
                                    <td style="min-width: 12rem">{{ department.id }}</td>
                                    <td style="min-width: 16rem">{{ department.name }}</td>
                                    <td>{{ department.description }}</td>
                                    <td>
                                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editDepartment(department)" />
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteDepartment(department)" />
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>

                        <p-dialog [(visible)]="departmentDialog" [style]="{ width: '450px' }" header="Department Details" [modal]="true">
                            <ng-template #content>
                                <div class="flex flex-col gap-6">
                                    <div>
                                        <label for="name" class="block font-bold mb-3">Name</label>
                                        <input type="text" pInputText id="name" [(ngModel)]="department.name" required autofocus fluid />
                                        <small class="text-red-500" *ngIf="submittedDepartment && !department.name">Name is required.</small>
                                    </div>
                                    <div>
                                        <label for="description" class="block font-bold mb-3">Description</label>
                                        <textarea id="description" pTextarea [(ngModel)]="department.description" required rows="3" cols="20" fluid></textarea>
                                    </div>
                                </div>
                            </ng-template>

                            <ng-template #footer>
                                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogDepartment()" />
                                <p-button label="Save" icon="pi pi-check" (click)="saveDepartment()" />
                                
                            </ng-template>
                        </p-dialog>

                        <!-- <p-confirmdialog [style]="{ width: '450px' }" /> -->
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        <p-toolbar styleClass="mb-6">
                            <ng-template #start>
                                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNewPosition()" />
                            </ng-template>

                            <ng-template #end>
                                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                            </ng-template>
                        </p-toolbar>

                        <p-table
                            #dtPositions
                            [value]="positions()"
                            [rows]="10"
                            [columns]="cols"
                            [paginator]="true"
                            [globalFilterFields]="['name', 'description']"
                            [tableStyle]="{ 'min-width': '75rem' }"
                            [rowHover]="true"
                            dataKey="id"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} positions"
                            [showCurrentPageReport]="true"
                            [rowsPerPageOptions]="[10, 20, 30]"
                        >
                            <ng-template #caption>
                                <div class="flex items-center justify-between">
                                    <h5 class="m-0">Manage Positions</h5>
                                    <p-iconfield>
                                        <p-inputicon styleClass="pi pi-search" />
                                        <input pInputText type="text" (input)="onGlobalFilter($event, dtPositions)" placeholder="Search..." />
                                    </p-iconfield>
                                </div>
                            </ng-template>
                            <ng-template #header>
                                <tr>
                                    <th style="min-width: 16rem">Id</th>
                                    <th pSortableColumn="name" style="min-width:16rem">
                                        Name
                                        <p-sortIcon field="name" />
                                    </th>
                                
                                    <th pSortableColumn="description" style="min-width: 8rem">
                                        Description
                                        <p-sortIcon field="description" />
                                    </th>
                                    
                                    <th style="min-width: 12rem"></th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-position>
                                <tr>
                                    <td style="min-width: 12rem">{{ position.id }}</td>
                                    <td style="min-width: 16rem">{{ position.name }}</td>
                                    <td>{{ position.description }}</td>
                                    <td>
                                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editPosition(position)" />
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deletePosition(position)" />
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>

                        <p-dialog [(visible)]="positionDialog" [style]="{ width: '450px' }" header="Position Details" [modal]="true">
                            <ng-template #content>
                                <div class="flex flex-col gap-6">
                                    <div>
                                        <label for="name" class="block font-bold mb-3">Name</label>
                                        <input type="text" pInputText id="name" [(ngModel)]="position.name" required autofocus fluid />
                                        <small class="text-red-500" *ngIf="submittedPosition && !position.name">Name is required.</small>
                                    </div>
                                    <div>
                                        <label for="description" class="block font-bold mb-3">Description</label>
                                        <textarea id="description" pTextarea [(ngModel)]="position.description" required rows="3" cols="20" fluid></textarea>
                                    </div>
                                </div>
                            </ng-template>

                            <ng-template #footer>
                                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogPosition()" />
                                <p-button label="Save" icon="pi pi-check" (click)="savePosition()" />
                                
                            </ng-template>
                        </p-dialog>

                        <!-- <p-confirmdialog [style]="{ width: '450px' }" /> -->
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        <p-toolbar styleClass="mb-6">
                            <ng-template #start>
                                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNewRole()" />
                            </ng-template>

                            <ng-template #end>
                                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                            </ng-template>
                        </p-toolbar>

                        <p-table
                            #dtRoles
                            [value]="roles()"
                            [rows]="10"
                            [columns]="cols"
                            [paginator]="true"
                            [globalFilterFields]="['name', 'description']"
                            [tableStyle]="{ 'min-width': '75rem' }"
                            [rowHover]="true"
                            dataKey="id"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} positions"
                            [showCurrentPageReport]="true"
                            [rowsPerPageOptions]="[10, 20, 30]"
                        >
                            <ng-template #caption>
                                <div class="flex items-center justify-between">
                                    <h5 class="m-0">Manage Roles</h5>
                                    <p-iconfield>
                                        <p-inputicon styleClass="pi pi-search" />
                                        <input pInputText type="text" (input)="onGlobalFilter($event, dtRoles)" placeholder="Search..." />
                                    </p-iconfield>
                                </div>
                            </ng-template>
                            <ng-template #header>
                                <tr>
                                    <th style="width: 8rem">Id</th>
                                    <th pSortableColumn="name" style="width:14rem">
                                        Name
                                        <p-sortIcon field="name" />
                                    </th>
                                
                                    <th pSortableColumn="description" style="width: 18rem">
                                        Description
                                        <p-sortIcon field="description" />
                                    </th>
                                    <th pSortableColumn="permission" style="min-width: 30rem">
                                        Permission
                                        <p-sortIcon field="permission" />
                                    </th>
                                    <th style="min-width: 10rem"></th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-role>
                                <tr>
                                    <td style="min-width: 12rem">{{ role.id }}</td>
                                    <td style="min-width: 16rem">{{ role.name }}</td>
                                    <td>{{ role.description }}</td>
                                    <td>
                                        <ng-container *ngFor="let per of role.permissions">
                                            <p-chip [label]="per.name" />
                                        </ng-container>
                                       

                                    </td>
                                    <td>
                                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editRole(role)" />
                                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteRole(role)" />
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>

                        <p-dialog [(visible)]="roleDialog" [style]="{ width: '450px' }" header="Role Details" [modal]="true">
                            <ng-template #content>
                                <div class="flex flex-col gap-6">
                                    <div>
                                        <label for="name" class="block font-bold mb-3">Name</label>
                                        <input type="text" pInputText id="name" [(ngModel)]="role.name" required autofocus fluid />
                                        <small class="text-red-500" *ngIf="submittedRole && !role.name">Name is required.</small>
                                    </div>
                                    <div>
                                        <label for="description" class="block font-bold mb-3">Description</label>
                                        <textarea id="description" pTextarea [(ngModel)]="role.description" required rows="3" cols="20" fluid></textarea>
                                    </div>
                                    <div>
                                        <label for="permission" class="block font-bold mb-3">Permission</label>
                                        <p-autocomplete [(ngModel)]="role.permissions" [suggestions]="autoFilteredValue" optionLabel="name" appendTo="body" placeholder="Search" 
                                        dropdown multiple display="chip" 
                                        (completeMethod)="filterPermission($event)" (onSelect)="onPermissionSelect($event)" (onUnselect)="onPermissionUnselect($event)"/>
                                    </div>
                                </div>
                            </ng-template>

                            <ng-template #footer>
                                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialogRole()" />
                                <p-button label="Save" icon="pi pi-check" (click)="saveRole()" />
                                
                            </ng-template>
                        </p-dialog>

                        <!-- <p-confirmdialog [style]="{ width: '450px' }" /> -->
                    </p-tabpanel>
                    <p-tabpanel value="3">
                        <p-toolbar styleClass="mb-6">

                            <ng-template #end>
                                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                            </ng-template>
                        </p-toolbar>

                        <p-table
                            #dtPermissions
                            [value]="permissions()"
                            [rows]="10"
                            [columns]="cols"
                            [paginator]="true"
                            [globalFilterFields]="['name', 'description']"
                            [tableStyle]="{ 'min-width': '75rem' }"
                            [rowHover]="true"
                            dataKey="id"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} positions"
                            [showCurrentPageReport]="true"
                            [rowsPerPageOptions]="[10, 20, 30]"
                        >
                            <ng-template #caption>
                                <div class="flex items-center justify-between">
                                    <h5 class="m-0">List Permissions</h5>
                                    <p-iconfield>
                                        <p-inputicon styleClass="pi pi-search" />
                                        <input pInputText type="text" (input)="onGlobalFilter($event, dtPermissions)" placeholder="Search..." />
                                    </p-iconfield>
                                </div>
                            </ng-template>
                            <ng-template #header>
                                <tr>
                                    <th style="min-width: 16rem">Id</th>
                                    <th pSortableColumn="name" style="min-width:16rem">
                                        Name
                                        <p-sortIcon field="name" />
                                    </th>
                                
                                    <th pSortableColumn="description" style="min-width: 8rem">
                                        Description
                                        <p-sortIcon field="description" />
                                    </th>
                                    
                                </tr>
                            </ng-template>
                            <ng-template #body let-permission>
                                <tr>
                                    <td style="min-width: 12rem">{{ permission.id }}</td>
                                    <td style="min-width: 16rem">{{ permission.name }}</td>
                                    <td>{{ permission.description }}</td>
                                </tr>
                            </ng-template>
                        </p-table>

                    
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
    

})
export class GeneralInformation implements OnInit {
    departmentDialog: boolean = false;
    
    departments = signal<IDepartment[]>([]);

    department!: IDepartment;

    positionDialog: boolean = false;
    
    positions = signal<IDepartment[]>([]);

    position!: IDepartment;

    roleDialog: boolean = false;
    
    roles = signal<IRolePermission[]>([]);

    role!: IRolePermission;

    permissionDialog: boolean = false;
    
    permissions = signal<IRolePermission[]>([]);

    autoFilteredValue: IRolePermission[] = [];

    permission!: IRolePermission;

    selectedProducts!: Product[] | null;

    submittedDepartment: boolean = false;

    submittedPosition: boolean = false;

    submittedRole: boolean = false;

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private departmentService: DepartmentService,
        private positionService: PositionService,
        private roleService: RoleService,
        private permissionService: PermissionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDepartment();
        this.loadPosition();
        this.loadRole();
        this.loadPermission();
    }

    loadDepartment() {
         
        this.departmentService.getDepartments$().subscribe((data) => {
            this.departments.set(data);
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
        
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadPosition() {
         
        this.positionService.getPosition$().subscribe((data) => {
            this.positions.set(data);
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
        
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadRole() {
         
        this.roleService.getRoles$().subscribe((data) => {
            this.roles.set(data);
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'permission', header: 'Permission' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    loadPermission() {
        this.permissionService.getPermissions$().subscribe((data: IRolePermission[]) => {
            this.permissions.set(data);
        });

        this.cols = [
            { field: 'id', header: 'ID' },
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
        
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(event: any, table: Table) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNewDepartment() {
        this.department = {
            id: null,
            name: "",
            description: ""
        };

        this.submittedDepartment = false;
        this.departmentDialog = true;
    }

    openNewPosition() {
        this.position = {
            id: null,
            name: "",
            description: ""
        };

        this.submittedPosition = false;
        this.positionDialog = true;
    }

    openNewRole() {
        this.role = {
            id: null,
            name: "",
            description: "",
            permissions: []
        };

        this.submittedRole = false;
        this.roleDialog = true;
    }

    editDepartment(department: IDepartment) {
        this.department = { ...department };
        this.departmentDialog = true;
    }

    editPosition(position: IDepartment) {
        this.position = { ...position };
        this.positionDialog = true;
    }

    editRole(role: IRolePermission) {
        this.role = { ...role };
        this.roleDialog = true;
    }


    hideDialogDepartment() {
        this.departmentDialog = false;
        this.submittedDepartment = false;
    }

    hideDialogPosition() {
        this.positionDialog = false;
        this.submittedPosition = false;
    }

    hideDialogRole() {
        this.roleDialog = false;
        this.submittedRole= false;
    }

    deleteDepartment(department: IDepartment) {
        console.log('deleteDepartment')
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + department.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.departmentService.deleteDepartmentById$(Number(department.id)).subscribe((res)=> {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Department Deleted',
                        // life: 3000
                    });
                this.loadDepartment()
                })
                
            }
        });
    }

    deletePosition(position: IDepartment) {
        console.log('deletePosition')
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + position.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.positionService.deletePositionById$(Number(position.id)).subscribe((res)=> {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Department Deleted',
                        // life: 3000
                    });
                this.loadPosition()
                })
                
            }
        });
    }


    deleteRole(role: IRolePermission) {
        console.log('deletePosition')
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + role.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.roleService.deleteRoleById$(Number(role.id)).subscribe((res)=> {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Role Deleted',
                        // life: 3000
                    });
                this.loadRole()
                })
                
            }
        });
    }


    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.departments().length; i++) {
            if (this.departments()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

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

    saveDepartment() {
        this.submittedDepartment = true;
        let _departments = this.departments();
        if (this.department.name?.trim()) {
            if (this.department.id) {
                this.departmentService.updateDepartmentById$(this.department).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Department Updated',
                        life: 3000
                    });
                    this.loadDepartment()
                })
                
            } else {
                this.departmentService.addDepartment$(this.department).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Department Created',
                        life: 3000
                    });
                    this.loadDepartment()
                })
            }

            this.departmentDialog = false;
            this.department = {
                id: null,
                name: "",
                description: ""
            };
        }
    }

    savePosition() {
        this.submittedPosition = true;
        let _positions = this.positions();
        if (this.position.name?.trim()) {
            if (this.position.id) {
                this.positionService.updatePositionById$(this.position).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Position Updated',
                        life: 3000
                    });
                    this.loadPosition()
                })
                
            } else {
                this.positionService.addPosition$(this.position).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Position Created',
                        life: 3000
                    });
                    this.loadPosition()
                })
            }

            this.positionDialog = false;
            this.position = {
                id: null,
                name: "",
                description: ""
            };
        }
    }

    saveRole() {
        this.submittedRole = true;
        let _roles = this.roles();
        if (this.role.name?.trim()) {
            if (this.role.id) {
                this.roleService.updateRoleById$(this.role).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Role Updated',
                        life: 3000
                    });
                    this.loadRole()
                })
                
            } else {
                this.roleService.addRole$(this.role).subscribe((res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Role Created',
                        life: 3000
                    });
                    this.loadRole()
                })
            }

            this.roleDialog = false;
            this.role = {
                id: null,
                name: "",
                description: "",
                permissions: [],
            };
        }
    }

    filterPermission(event: AutoCompleteCompleteEvent) {
        const filtered: any[] = [];
        const query = event.query;

        for (let i = 0; i < (this.permissions() as any[]).length; i++) {
            const permission = (this.permissions() as any[])[i];
            if (permission.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(permission);
            }
        }

        this.autoFilteredValue = filtered;
    }

    // khi chọn permission
    onPermissionSelect(event: any) {
        const perm = event.value; // object {id, name, ...}
        if (!this.role.permissions.map(per => per.id).includes(perm.id)) {
            this.role.permissions.push(perm);
        }
        console.log(perm)
    }

    // khi bỏ chọn permission
    onPermissionUnselect(event: any) {
        const perm = event.value;
        this.role.permissions = this.role.permissions.filter(id => id !== perm.id);
    }
}