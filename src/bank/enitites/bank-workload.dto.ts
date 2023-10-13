import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BankEntity } from "./bank.entity";

@Entity({name: 'bank-workload'})
export class BankWorkloadEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    nameService: string
    
    @Column({nullable: false}) 
    bankId: number
    @ManyToOne(() => BankEntity, (bank) => bank.Workload)
    Bank: BankEntity
}