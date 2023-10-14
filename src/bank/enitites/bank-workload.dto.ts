import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BankEntity } from "./bank.entity";
import { UsersEntity } from "src/users/enities/users.enities";

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

    @Column({nullable: false, unique: false})
    userId: number
    @ManyToOne(() => UsersEntity, (user) => user.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: UsersEntity
}