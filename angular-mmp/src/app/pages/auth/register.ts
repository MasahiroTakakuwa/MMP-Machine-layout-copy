import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { RippleModule } from "primeng/ripple";
import { AppFloatingConfigurator } from "../../layout/component/app.floatingconfigurator";
import { AuthService } from "../../services/auth.service";
import { DepartmentService } from "../../services/department.service";
import { IDepartment } from "../../interface/permission";
import { PositionService } from "../../services/position.service";
import { ConfirmedValidator } from "../../validators/confirm-password";


@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-10 px-8 sm:px-20" style="border-radius: 53px">
                    
                    <div class="text-center mb-8">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-6 w-16 shrink-0 mx-auto">
                            <!-- bạn có thể reuse icon giống login -->
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M17.1637 19.2467C17.1566 19.4033..."
                                fill="var(--primary-color)"
                            />
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Sign Up</div>
                        <span class="text-muted-color font-medium">Create your account</span>
                    </div>

                    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
                        <span class="p-float-label">
                            <label for="user_name">User Name</label>
                            <input pInputText id="user_name" formControlName="user_name" class="w-full" />
                        </span>
                        <div>
                            <label>Password</label>
                            <input type="password" formControlName="password"
                                    class="w-full border rounded p-2" />
                            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid"
                                class="text-red-500 text-sm">
                                <span *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</span>
                                <span *ngIf="registerForm.get('password')?.errors?.['minlength']">
                                Password must be at least 6 characters
                                </span>
                            </div>
                        </div>

                        <div>
                            <label>Confirm Password</label>
                            <input type="password" formControlName="password_confirm" class="border p-2 w-full"/>
                            <div *ngIf="registerForm.get('password_confirm')?.touched 
                                        && registerForm.get('password_confirm')?.errors?.['confirmedValidator']"
                                class="text-red-500 text-sm">
                                Confirmation password does not match
                            </div>
                        </div>
                        <span class="p-float-label">
                            <label for="first_name">First Name</label>
                            <input pInputText id="first_name" formControlName="first_name" class="w-full" />
                        </span>

                        <span class="p-float-label">
                            <label for="last_name">Last Name</label>
                            <input pInputText id="last_name" formControlName="last_name" class="w-full" />
                        </span>

                        <span class="p-float-label">
                            <label for="email">Email</label>
                            <input pInputText id="email" formControlName="email" type="email" class="w-full" />
                        </span>
                        <span class="p-float-label">
                            <label for="phone_number">Phone Number</label>
                            <input pInputText id="phone_number" formControlName="phone_number" class="w-full" />
                        </span>
                        <div>
                            <label class="block text-sm font-medium">Department</label>
                            <select formControlName="departmentId" class="w-full border rounded p-2">
                                <option value="">-- Select Department --</option>
                                <option *ngFor="let dept of departments" [ngValue]="dept.id">
                                {{ dept.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium">Position</label>
                            <select formControlName="positionId" class="w-full border rounded p-2">
                                <option value="">-- Select Position --</option>
                                <option *ngFor="let pos of positions" [ngValue]="pos.id">
                                {{ pos.name }}
                                </option>
                            </select>
                        </div>
                    
                        <!-- <span class="p-float-label">
                            <input pInputText id="roleIds" formControlName="roleIds" class="w-full" placeholder="e.g: 1,2,3" />
                            <label for="roleIds">Role IDs</label>
                        </span> -->
                        <!-- <span class="p-float-label">
                            <input pInputText id="avatar" formControlName="avatar" class="w-full" />
                            <label for="avatar">Avatar URL</label>
                        </span> -->

                        <!-- <span class="p-float-label">
                            <select id="status" formControlName="status" class="w-full p-inputtext">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <label for="status">Status</label>
                        </span> -->

                        <p-button label="Register" styleClass="w-full" type="submit" [disabled]="registerForm.invalid"></p-button>
                    </form>

                    <div class="mt-5 text-center text-600">
                        Already have an account?
                        <a routerLink="/auth/login" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Login</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})

export class RegisterComponent {
    registerForm!: FormGroup;
    departments: IDepartment[] = []; // lưu danh sách phòng ban lấy từ API
    positions: any[] = [];
    http: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // 👇 khởi tạo trong constructor
    this.registerForm = this.fb.group({
      user_name: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', Validators.required],
      departmentId: [null, Validators.required],
      positionId: [null, Validators.required],
      roleIds: [[]],
      status: ['active'],
      phone_number: ['', Validators.required],
      avatar: ['']
    }, { validator: ConfirmedValidator('password', 'password_confirm') });
    this.loadDepartments();
    this.loadPositions();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments$().subscribe({
      next: (data: IDepartment[]) => {
        this.departments = data;
        // console.log("✅ Departments loaded:", this.departments);
      },
      error: (err) => {
        // console.error('❌ Lỗi khi load departments:', err);
      }
    });
  }

  loadPositions(): void {
    this.positionService.getPosition$().subscribe({
      next: (res) => (this.positions = res),
      error: (err) => console.error('Lỗi load positions', err)
    });
  }

  onSubmit() {
    // console.log(this.registerForm.valid);
    // if (this.registerForm.invalid) {
    //   return;
    // }
    console.log(this.registerForm.value)
    this.authService.signup$(this.registerForm.value).subscribe({
      next: () => {
        alert('Đăng ký thành công, mời bạn đăng nhập');
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        alert('Đăng ký thất bại, vui lòng thử lại');
      }
    });
  }

}