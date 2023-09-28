import { DataType,Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';


@Table({ paranoid: true })
export class Product extends Model {
    @Column({primaryKey: true})
    id!: number;
    @Column
    price!: string;
    @Column
    name!: string;
    @Column
    description!: string;
    @Column(DataType.ARRAY(DataType.STRING))
    photo!: string[];
    @Column(DataType.JSON)
    stock!: {
        [color: string]: number;
    };
    @Column
    active!: Boolean;
    @Column
    type!: string;
    @CreatedAt
    createdAt!: Date;
    @UpdatedAt
    updatedAt!: Date;
    @DeletedAt
    deletedAt!: Date;
}