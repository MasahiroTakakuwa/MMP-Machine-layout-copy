import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineStatusHistory } from './models/machine-status-history.entity';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';

@Module({
    imports: [

        // ==========================================================================
        // 📦 Đăng ký entity cho các repository sử dụng @InjectRepository()
        //    @InjectRepository() で使用するエンティティを登録
        // ==========================================================================
        // TypeOrmModule.forFeature([MachineStatusHistory])
    ],
    // ============================================================================
    // 🎮 Controller điều khiển API
    //    APIルーティングを制御するコントローラー
    // ============================================================================
    controllers: [MachineController],

    // ============================================================================
    // ⚙️ Service chứa logic xử lý nghiệp vụ
    //    業務ロジックを含むサービス
    // ============================================================================
    providers: [MachineService],
})
export class MachineModule {}
