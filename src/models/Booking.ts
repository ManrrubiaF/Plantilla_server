import { DataType, BelongsTo, ForeignKey, Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { User } from './User';

@Table({paranoid:true})
export class Booking extends Model {
    @Column({primaryKey: true})
    id!: number;
    @ForeignKey(() => User)
    @Column
    userId!: Number;
    @BelongsTo(()=> User)
    user!: User;
    @Column
    productId!: Number;
    @Column(DataType.JSON)
    stock!: {
        [color: string]: number;
    };
    @CreatedAt
    createdAt!: Date;
    @UpdatedAt
    updatedAt!: Date;
    @DeletedAt
    deletedAt!: Date;
}

