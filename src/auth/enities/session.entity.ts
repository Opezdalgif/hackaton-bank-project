import { UsersEntity } from 'src/users/enities/users.enities';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'session' })
export class SessionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    userId: number;
    @ManyToOne(() => UsersEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'userId'})
    user: UsersEntity;

    @Column({default: false})
    isClosed: boolean;
}