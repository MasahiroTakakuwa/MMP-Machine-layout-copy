import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { IDepartment } from '../../interface/permission';
import { MessageModule } from 'primeng/message';

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
    template: `
        <p-toast />
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
                                <p-button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                            </ng-template>

                            <ng-template #end>
                                <p-button label="Export" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                            </ng-template>
                        </p-toolbar>

                        <p-table
                            #dt
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
                                        <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Search..." />
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
                                        <small class="text-red-500" *ngIf="submitted && !department.name">Name is required.</small>
                                    </div>
                                    <div>
                                        <label for="description" class="block font-bold mb-3">Description</label>
                                        <textarea id="description" pTextarea [(ngModel)]="department.description" required rows="3" cols="20" fluid></textarea>
                                    </div>
                                </div>
                            </ng-template>

                            <ng-template #footer>
                                <p-button label="Cancel" icon="pi pi-times" text (click)="hideDialog()" />
                                <p-button label="Save" icon="pi pi-check" (click)="saveDepartment()" />
                                
                            </ng-template>
                        </p-dialog>

                        <p-confirmdialog [style]="{ width: '450px' }" />
                    </p-tabpanel>
                    <p-tabpanel value="1">
                        
                    </p-tabpanel>
                    <p-tabpanel value="2">
                        
                    </p-tabpanel>
                    <p-tabpanel value="3">
                        
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
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
        MessageModule
    ],
    providers: [MessageService, DepartmentService, ConfirmationService]

})
export class GeneralInformation implements OnInit {
    departmentDialog: boolean = false;
    
    departments = signal<IDepartment[]>([]);

    department!: IDepartment;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private departmentService: DepartmentService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDepartment();
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.department = {
            id: null,
            name: "",
            description: ""
        };
        this.submitted = false;
        this.departmentDialog = true;
    }

    editDepartment(department: IDepartment) {
        this.department = { ...department };
        this.departmentDialog = true;
    }


    hideDialog() {
        this.departmentDialog = false;
        this.submitted = false;
    }

    deleteDepartment(department: IDepartment) {
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
        this.submitted = true;
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
}