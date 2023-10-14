import { BankEntity } from "src/bank/enitites/bank.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'statistics'})
export class StatisticsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    workloadCount: number

    @Column({nullable:false})
    bankId: number

    @OneToOne(() => BankEntity, (bank) => bank.Statistics)
    @JoinColumn({name: 'bankId'})
    Bank: BankEntity

}