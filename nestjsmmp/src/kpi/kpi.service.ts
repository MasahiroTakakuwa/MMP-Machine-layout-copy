import { Injectable } from "@nestjs/common";
import { EntityManager, In, Repository } from "typeorm";
import { Devices } from "./models/devices.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { query } from "express";

@Injectable()
export class KpiService {
  constructor(
    private entityManager: EntityManager,
    @InjectRepository(Devices)
    private readonly deviceRepo: Repository<Devices>
  ){}

// 指定された工場の品番一覧を取得する
async getPartsNoSummary(factory: number) {
  //  工場ごとの品番を取得する　※factory=0の場合は全工場として処理する
  const query = await this.deviceRepo
    .createQueryBuilder('m')
    .select(['m.parts_no AS parts_no'])
    .groupBy('m.parts_no')
  if(factory !== 0) {
    query.where('m_factory_type = :factory', {factory});
  }
    
  const result = await query.getRawMany();
  return result;
}
}