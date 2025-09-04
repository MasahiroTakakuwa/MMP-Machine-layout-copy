
//Interface to define data schedule stop machine
export interface StatusStopMachine {
  machine_status_history_id: number;       // 🇻🇳 Tên hoặc mã máy
                            // 🇯🇵 機械の名前または番号

  date_start: string;         //date start schedule stop machine       

  date_end: string | null;    //date stop schedule stop machine

  shift: number | string | undefined;  //shift in schedule stop machine

  content: string;   //reason stop machine
}
