import { IconEntity } from "src/icon/enities/icon.entity";
import { ServiceBankEntity } from "src/services/enities/service.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BankWorkloadEntity } from "./bank-workload.entity";
import { StatisticsEntity } from "src/statistics/entities/statistics.entity";

@Entity({name: 'bank'})
export class BankEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    name: string

    @Column({nullable: false})
    address: string

    @Column({nullable: false})
    phoneNumber: string

    @Column({nullable: true})
    icon: string

    @OneToMany(() => BankWorkloadEntity, (workloud) => workloud.Bank)
    Workload: BankWorkloadEntity[]

    @ManyToMany(() => ServiceBankEntity, (service) => service.Banks)
    Service: ServiceBankEntity[]

    @OneToOne(() => StatisticsEntity, (statistics) => statistics.Bank)
    Statistics: StatisticsEntity 
}