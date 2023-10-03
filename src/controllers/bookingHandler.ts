import { Booking, User, Product, ProductDetail } from "../db";
import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import config from "../lib/config";

const companyEmail: string = config.COMPANY_EMAIL || '';
const companyPass: string = config.COMPANY_PASS || '';
const host_email: string = config.HOST_MAIL || '';

interface dataProduct {
    id: number;
    details: Array<{
        productId: number;
        stock:number,
        color:string,
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

const discountStock =async (dataProducts: dataProduct) => {
    try {
        for(const details of dataProducts.details){
            const product: ProductDetail | null = await ProductDetail.findOne({
                where:{
                    productId: details.productId,
                    color: details.color
                }
            })
            if(product){
                product.stock -= details.stock;
                await product.save();
            }
            
        }
        return ('updated');
    } catch (error) {
        return error;        
    }    
}

const increaseProduct =async (bookingExist: dataProduct) => {
    try {
        for(const details of bookingExist.details){
            const product: ProductDetail | null = await ProductDetail.findOne({
                where:{
                    productId: details.productId,
                    color: details.color
                }
            })
            if(product){
                product.stock += details.stock;
                await product.save();
            }
            
        }
        return ('updated');        
    } catch (error) {
        
    }    
}

const createBooking = async (req: Request, res: Response) => {
    const dataProducts: dataProduct = req.body
    const { id } = res.locals.userData;


    try {
        let enoughStock = true;
        const details = dataProducts.details
        for(const product of details){
            const productExist: Product | null = await Product.findOne({
                where:{
                    id: product.productId
                },
                include:ProductDetail
            });
            const detailsProduct = productExist?.details;
            let index = 0
            if(detailsProduct){
                while (enoughStock && index < detailsProduct.length) {
                    if(product.color === detailsProduct[index].color && detailsProduct[index].stock < product.stock){
                        enoughStock = false;
                    }
                    index ++;
                }    
            }
        }
        if(enoughStock){
            await Booking.create({
                userId: id,
                details: details,
            })
            const user = await User.findByPk(id);
            await transporter.sendMail({
                from: `${companyEmail}`,
                to: `${user?.email}`,
                subject: 'Confirmaciòn de reserva',
                html: 'Gracias por comprar en esta empresa, su reserva ha sido guardada.'
            })
            await discountStock(dataProducts);
            res.status(201).send('Reserva/Compra creada')
        }else{
            res.status(400).send('Lo sentimos,no hay suficiente stock')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteBooking = async (req: Request, res: Response) => {
    const newData = req.params
    const { id } = res.locals.userData;
    try {
        const bookingExist = await Booking.findOne({
            where:{
                id: newData.id,
                userId: id
            }
        });
        if (!bookingExist) {
            res.status(404).send('Reserva/Compra no encontrada')
        }else{
            await increaseProduct(bookingExist)
            await bookingExist?.destroy()
            res.status(200).send('Su reserva/compra ha sido cancelada')
        }
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

const updateStatus =async (req:Request, res:Response) => {
    const { id, status } = req.body
    
    try {
        const bookingExist = await Booking.findOne({
            where:{
                id: id
            }
        })
        if(bookingExist){
            await bookingExist.update(status);
            res.status(200).send('Booking Cancel')
        }else{
            res.status(404).send("Booking doesn't exist")
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
    updateStatus
}