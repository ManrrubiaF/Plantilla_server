import { Booking, User, Product } from "../db";
import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import config from "../lib/config";

const companyEmail: string = config.COMPANY_EMAIL || '';
const companyPass: string = config.COMPANY_PASS || '';
const back_url: string = config.BACK_URL || '';
const frontUrl: string = config.FRONT_URL || '';
const host_email: string = config.HOST_MAIL || '';

interface dataProduct {
    id: number;
    userId: number;
    products: Array<{
        productId: number;
        stock: {
            [color: string]: number;
        };
    }>;

}

const transporter = nodemailer.createTransport({
    host: `${host_email}`,
    port: 465,
    secure: true,
    auth: {
        user: companyEmail,
        pass: companyPass,
    },
})

const createBooking = async (req: Request, res: Response) => {
    const dataProducts: dataProduct = req.body
    const { id } = res.locals.userData;

    try {
        let enoughStock = true;
        for(const product of dataProducts.products){
            const productExist = await Product.findByPk(product.productId);
            const colorStock = Object.keys(product.stock) as string[];
            
            let index = 0
            if(productExist){
                while(enoughStock && index <= colorStock.length){
                    const color = colorStock[index];
                    if(!productExist.stock.hasOwnProperty(color)){
                        enoughStock = false;
                        const message = `Lo siento, se ha agotado el producto ${productExist.name} en color ${color}`;
                        res.status(400).send(message);
                    }
                    index ++;
                }  
            }
        }
        if(enoughStock){
            await Product.create({dataProducts})
            const user = await User.findByPk(id);
            await transporter.sendMail({
                from: `${companyEmail}`,
                to: `${user?.email}`,
                subject: 'Confirmaciòn de reserva',
                html: 'Gracias por comprar en esta empresa, su reserva ha sido guardada.'
            })
            res.status(201).send('Reserva/Compra creada')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteBooking = async (req: Request, res: Response) => {
    const dataProduct: dataProduct = req.body
    const { id } = res.locals.userData;
    try {
        const bookingExist = await Booking.findOne({
            where:{
                id: dataProduct.id,
                userId: id
            }
        });
        if (!bookingExist) {
            res.status(404).send('Reserva/Compra no encontrada')
        }
        const products = dataProduct.products;
        for (const oneProduct of products) {
            let updateProduct = await Product.findByPk(oneProduct.productId);

            if (updateProduct) {
                for (const oneColor of Object.keys(oneProduct.stock) as string[]) {
                  const currentStock = updateProduct.stock[oneColor] || 0;
                  const addStock = oneProduct.stock[oneColor] || 0;
                  updateProduct.stock[oneColor] = addStock + currentStock;
                }
              
                await updateProduct.save();
              }
        }
        await bookingExist?.destroy({ force: true })
        res.status(200).send('Su reserva/compra ha sido cancelada')
    } catch (error) {
        res.status(500).send('Server error')
    }
}

const getByUser =async (req:Request, res:Response) => {
    const { id } = res.locals.userData;

    try {
        const bookingByUser = await Booking.findAll({
            where:{
                userId: id
            }
        })
        if(bookingByUser){
            res.status(200).json(bookingByUser);
        }else{
            res.status(400).send('No se hicieron reservas o compras aún')
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
}

const getAllBookig =async (req:Request,res:Response) => {
    try {
        const allBooking = await Booking.findAll()
        if(allBooking){
            res.status(200).json(allBooking)
        }else{
            res.status(404).send('No te han reservado/comprado aún')
        }
    } catch (error) {
        res.status(500).json(error)
    }    
}

export default {
    createBooking,
    deleteBooking,
    getByUser,
    getAllBookig,
}