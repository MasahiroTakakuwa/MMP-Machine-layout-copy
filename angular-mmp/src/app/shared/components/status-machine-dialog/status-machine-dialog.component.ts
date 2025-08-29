import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Fluid } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { MachineService } from '../../../services/machine.service';
import { TableModule } from 'primeng/table';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { StatusStopMachine } from '../../../models/status-machine.model';
import { format } from 'date-fns';
import { Machine } from '../../../models/machine.model';

@Component({
  selector: 'app-status-machine-dialog',
  imports: [CommonModule, TabsModule, FormsModule, DialogModule, ButtonModule, SelectModule, DatePicker, InputTextModule, TextareaModule, Fluid, ReactiveFormsModule, MessageModule, TableModule],
  templateUrl: './status-machine-dialog.component.html',
  styleUrl: './status-machine-dialog.component.scss',
  
})
export class StatusMachineDialogComponent {

  listShifts = [
    {
      id: 1,
      name: "Shift Day"
    },
    {
      id: 2,
      name: "Shift Night"
    }
  ]
  listDowntimeHistory!: StatusStopMachine[]
  formData!: FormGroup
  machine_id!: number
  machine!: Machine
  constructor(
    private machineService: MachineService,
    private fb: FormBuilder,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.machine_id=this.config.data.machine.id
    this.machine=this.config.data.machine
    this.formData = this.fb.group({
      machine_status_history_id: [this.machine_id],
      date_start: [null, Validators.required],
      date_end: [null],
      shift: [null],
      content: [null, Validators.required]
    })
    this.getHistoryStopMachine()
  }

  saveStatusMachine() {
    console.log(this.formData?.value)
    if(!this.formData.invalid){
      const data_save : StatusStopMachine={
        machine_status_history_id: this.machine_id,
        date_start: format(this.formData.value.date_start, 'yyyy-MM-dd'),
        date_end: this.formData.value.date_end?format(this.formData.value.date_end, 'yyyy-MM-dd'): null,
        shift: this.formData.value.shift,
        content: this.formData.value.content
      }
      this.ref.close({type: 'save-status-machine', value: data_save})
    }
  }

  setRunMachine(){
    this.ref.close({type: 'run-machine', value: this.machine_id})
  }

  getHistoryStopMachine(){
    this.machineService.getStatusMachine(this.machine_id).subscribe({
      next: (res: StatusStopMachine[])=>{
        console.log(res)
        this.listDowntimeHistory=res.map(element=>{
          return {
            ...element,
            shift: element.shift?this.listShifts.find(e=>e.id==element.shift)?.name:'All day',
            date_end: element.date_end??'Undetermined'
          }
        })
      },
      error: (error)=>{
        console.log(error)
      }
    })
  }  

  isInvalid(controlName: string) {
    const control = this.formData.get(controlName);
    return control?.invalid && (control.touched);
  }

  close() {
    this.ref.close();
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
