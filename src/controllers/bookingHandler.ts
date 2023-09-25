import { Op } from "sequelize";
import { Booking, User, Product } from "../db";
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
require('dotenv');

const jwt_secret: string = process.env.JWT_SECRET || '';
const companyEmail: string = process.env.COMPANY_EMAIL || '';
const companyPass: string = process.env.COMPANY_PASS || '';
const back_url: string = process.env.BACK_URL || '';
const frontUrl: string = process.env.FRONT_URL || '';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: companyEmail,
        pass: companyPass,
    },
})

const createBooking = async (req: Request, res: Response) => {
    const data = req.body
    const authorizationHeader = req.headers['authorization'];
    const authorization: string = authorizationHeader || '';


    try {
        const stockExist = await Product.findOne({
            where: {
                id: data.productId,
                stock: {
                    [Op.gt]: 0,
                }
            }
        })
        const token = authorization.split(" ")[1].replace(/"/g, '');
        const decodedToken:any = jwt.verify(token, jwt_secret);
        if (stockExist && decodedToken) {
            await Booking.create({
                userId: decodedToken.id,
                productId: data.productId,
                stock: data.stock
            })
            res.status(201).send('Su reserva fue agendada')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteBooking = async (req:Request, res:Response) => {
    const data = req.body

    try {
        const bookingExist = await Booking.findByPk(data.id)
        const productBooking = await Product.findOne({
           where:{
            
           } 
        })
    } catch (error) {
        
    }
}

export default {
    createBooking,
}