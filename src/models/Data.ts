import { DataType, Table, Column, Model } from 'sequelize-typescript';

@Table
export class Data extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
    @Column
    aboutText!:string;
    @Column(DataType.ARRAY(DataType.STRING))
    videos!:string[];
    @Column(DataType.ARRAY(DataType.STRING))
    photos!:string[];
    @Column
    phone!:number;
    @Column
    whatsapp!:number;
    @Column
    email!:string;
    @Column(DataType.ARRAY(DataType.STRING))
    socialLinks!: string[];
    
}
   
