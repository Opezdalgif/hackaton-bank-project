import { BankEntity } from "src/bank/enitites/bank.entity";
import { UsersEntity } from "src/users/enities/users.enities";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'review'})
export class Reviewentity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    text: string

    @Column({nullable: false})
    mark: string

    @Column({nullable: false})
    bankId: number
    @ManyToOne(() => BankEntity, (bank) => bank.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'bankId'})
    bank: BankEntity

    @Column({nullable: false})
    userId: number
    @ManyToOne(() => UsersEntity, (user) => user.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: UsersEntity
}