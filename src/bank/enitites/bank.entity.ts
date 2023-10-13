import { IconEntity } from "src/icon/enities/icon.entity";
import { ServiceBankEntity } from "src/services/enities/service.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => ServiceBankEntity, (service) => service.Banks)
    Service: ServiceBankEntity[]

    @OneToOne(() => IconEntity, (icon) => icon.Bank,{onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    Icon: IconEntity
}