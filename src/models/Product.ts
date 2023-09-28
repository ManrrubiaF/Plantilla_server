import { Table,HasMany, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { ProductDetail } from './ProductDetail';


@Table({ paranoid: true })
export class Product extends Model {
    @Column({ primaryKey: true })
    id!: number;
    @Column
    price!: string;
    @Column
    name!: string;
    @Column
    description!: string;
    @Column
    active!: Boolean;
    @Column
    category!: string;
    @CreatedAt
    createdAt!: Date;
    @UpdatedAt
    updatedAt!: Date;
    @DeletedAt
    deletedAt!: Date;

    @HasMany(() => ProductDetail)
    details!: ProductDetail[];
}