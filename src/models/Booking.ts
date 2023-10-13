import { DataType, BelongsTo, ForeignKey, Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { User } from './User';
import 'reflect-metadata';



@Table({paranoid:true})
export class Booking extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
    @ForeignKey(() => User)
    @Column
    userId!: number;
    @BelongsTo(()=> User)
    user!: User;
    @Column(DataType.ARRAY(DataType.JSONB))
    details!: {
        productId: number;
        color:string;
        stock:number;
    }[];
    @Column({defaultValue: 'unpaid'})
    status!:string;
    @CreatedAt
    createdAt!: Date;
    @UpdatedAt
    updatedAt!: Date;
    @DeletedAt
    deletedAt!: Date;
}

