import { Table,HasMany, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';
import { ProductDetail } from './ProductDetail';


@Table({ paranoid: true })
export class Product extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
    @Column({defaultValue: 'Sin precio'})
    price!: string;
    @Column
    name!: string;
    @Column
    description!: string;
    @Column({defaultValue: true})
    active!: Boolean;
    @Column
    category!: string;
    @CreatedAt
    createdAt!: Date;
    @UpdatedAt
    updatedAt!: Date;
    @DeletedAt
    deletedAt!: Date;

    @HasMany(() => ProductDetail, {
        onDelete: 'CASCADE',
    })
    details!: ProductDetail[];
}