import { UsersEntity } from "src/users/enities/users.enities";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'achivments'})
export class AchivmentsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    name: string

    @Column({nullable: false})
    get: string

    @Column({nullable: false})
    icon: string

    @ManyToMany(() => UsersEntity, (user) => user.Achivments)
    @JoinTable({
        name: 'users_achivments',
        joinColumn: {
            name: 'userId', 
            referencedColumnName: 'id', 
        },
        inverseJoinColumn: {
            name: 'achivmentsId', 
            referencedColumnName: 'id', 
        },
    })
    Users: UsersEntity[]
}