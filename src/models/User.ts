import { Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';


@Table({paranoid:true})
export class User extends Model {
  @Column({primaryKey: true})
  id!: number;
  @Column
  email!: string;
  @Column
  pass!:string;
  @Column
  name!:string;
  @Column
  lastName!:string;
  @Column
  phone!:number;
  @Column
  access!:string;
  @CreatedAt
  createdAt!: Date;
  @UpdatedAt
  updatedAt!: Date;
  @DeletedAt
  deletedAt!: Date;

}