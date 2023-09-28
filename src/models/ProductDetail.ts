import { DataType, Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Product } from './Product';

@Table
export class ProductDetail extends Model {
  @Column
  color!: string;
  @Column
  stock!: number;
  @Column(DataType.ARRAY(DataType.STRING))
  image!: string[];

  @ForeignKey(() => Product)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;
}
