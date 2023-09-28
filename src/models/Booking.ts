import { DataType, Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

@Table({paranoid:true})
export class Booking extends Model {
    @Column({primaryKey: true})
    id!: number;
    @Column
    userId!: Number;
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

