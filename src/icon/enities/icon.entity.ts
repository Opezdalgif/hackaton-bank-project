import { BankEntity } from "src/bank/enitites/bank.entity";
import { UsersEntity } from "src/users/enities/users.enities";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'icon'})
export class IconEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    icon: string

    @Column({nullable: true})
    userId: number | null
    @OneToOne(() => UsersEntity, (user) => user.Icon,{onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    User: UsersEntity

    @Column({nullable: true})
    bankId: number | null
    @OneToOne(() => BankEntity, (bank) => bank.Icon,{onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    Bank: BankEntity
}