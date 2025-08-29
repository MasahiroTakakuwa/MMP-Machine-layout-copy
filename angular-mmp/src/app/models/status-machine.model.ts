

export interface StatusStopMachine {
  machine_status_history_id: number;       // 🇻🇳 Tên hoặc mã máy
                            // 🇯🇵 機械の名前または番号

  date_start: string;                

  date_end: string | null;               

  shift: number | string | undefined;        

  content: string; 
}
