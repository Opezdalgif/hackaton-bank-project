import { BankEntity } from "src/bank/enitites/bank.entity";
import { UsersEntity } from "src/users/enities/users.enities";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'service-bank'})
export class ServiceBankEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    name: string

    @ManyToMany(() => BankEntity, (banks) => banks.Service)
    @JoinTable({
        name: 'bank_services',
        joinColumn: {
            name: 'bankId', 
            referencedColumnName: 'id', 
        },
        inverseJoinColumn: {
            name: 'serviceId', 
            referencedColumnName: 'id', 
        },
    })
    Banks: BankEntity[];
}