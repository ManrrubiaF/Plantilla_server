import { User } from "../db";
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const jwt_secret:string = process.env.JWT_SECRET || '';
const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


const loginUser = async (req: Request, res: Response) => {
    const { email, pass } = req.body

    try {
        const hashedPass = bcrypt.hash(pass, 5)
        const user = await User.findOne({
            where: {
                email: email,
                pass: hashedPass,
            }
        })
        if (user) {
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    lastName: user.lastName,
                    phone: user.phone,
                    access: user.access
                },
                jwt_secret,
                { expiresIn: '24h' }
            )
            res.cookie('token', token, {
                expires: expirationDate,
            }).send('Bienvenid@')
        } else {
            res.status(400).send('Por favor revise sus datos de sesión')
        }
    } catch (error) {
        res.status(500).send('Server Error')

    }

}

export default {
    loginUser,
}