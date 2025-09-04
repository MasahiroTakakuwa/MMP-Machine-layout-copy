import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { StatusStopMachine } from '../../../models/status-machine.model';
import { format } from 'date-fns';
import { Machine } from '../../../models/machine.model';

//This dialog is used to input schedule stop machine and set Run status machine
@Component({
  selector: 'app-status-machine-dialog',
  imports: [CommonModule, TabsModule, FormsModule, DialogModule, ButtonModule, SelectModule, DatePicker, InputTextModule, TextareaModule, Fluid, ReactiveFormsModule, MessageModule, TableModule],
  templateUrl: './status-machine-dialog.component.html',
  styleUrl: './status-machine-dialog.component.scss',
  
})
export class StatusMachineDialogComponent {

  //List shifts
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
  listDowntimeHistory!: StatusStopMachine[] //data table history stop machine
  formData!: FormGroup  //form data of data input
  machine_id!: number  //machine id
  machine!: Machine  //data machine come from parent component
  constructor( //services use in dialog
    private machineService: MachineService,
    private fb: FormBuilder,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.machine_id=this.config.data.machine.id
    this.machine=this.config.data.machine
    this.formData = this.fb.group({ //declare form data input
      machine_status_history_id: [this.machine_id],
      date_start: [null, Validators.required],
      date_end: [null],
      shift: [null],
      content: [null, Validators.required]
    })
    this.getHistoryStopMachine()
  }

  saveStatusMachine() {
    if(!this.formData.invalid){ //check form data valid
      const data_save : StatusStopMachine={
        machine_status_history_id: this.machine_id,
        date_start: format(this.formData.value.date_start, 'yyyy-MM-dd'), //change format date (year-month-day)
        date_end: this.formData.value.date_end?format(this.formData.value.date_end, 'yyyy-MM-dd'): null,
        shift: this.formData.value.shift,
        content: this.formData.value.content
      }
      this.ref.close({type: 'save-status-machine', value: data_save}) //close dialog and transfer data to parent component
    }
  }

  setRunMachine(){
    this.ref.close({type: 'run-machine', value: this.machine_id}) //close dialog and transfer data to parent component
  }

  getHistoryStopMachine(){ //get history stop machine so show in table
    this.machineService.getStatusMachine(this.machine_id).subscribe({
      next: (res: StatusStopMachine[])=>{
        // console.log(res)
        this.listDowntimeHistory=res.map(element=>{
          return {
            ...element,
            shift: element.shift?this.listShifts.find(e=>e.id==element.shift)?.name:'All day', //if shift is not null, get shift name. Else, set to all day
            date_end: element.date_end??'Undetermined' //if date_end is null, set to Undetermined
          }
        })
      },
      error: (error)=>{
        console.log(error)
      }
    })
  }  

  isInvalid(controlName: string) { //check field valid
    const control = this.formData.get(controlName);
    return control?.invalid && (control.touched);
  }

  close() { //close dialog
    this.ref.close();
  }

  ngOnDestroy() { //this function will be called when this dialog closed
    if (this.ref) {
      this.ref.close();
    }
  }
}
