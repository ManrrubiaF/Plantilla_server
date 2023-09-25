import { User } from '../db';
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
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
const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

const createUser = async (req: Request, res: Response): Promise<void> => {
    const { email, pass, name, lastName, phone, access } = req.body;

    try {
        const exist = await User.findOne({
            where: {
                email: email,
                raw: true
            }
        })
        if (exist) {
            res.status(400).send('Usuario existente')
        }
        const hashed = await bcrypt.hash(pass, 5)
        const newUser = await User.create({
            email,
            pass: hashed,
            name,
            lastName,
            phone,
            access,
        })

        const payload = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            lastName: newUser.lastName,
            phone: newUser.phone,
            access: newUser.access
        };
        const token = jwt.sign(payload, jwt_secret, { expiresIn: "24h" })


        res.cookie("token", token, {
            expires: expirationDate
        })
        res.send('Bienvenid@')
    } catch (error) {
        res.status(400).json({ error: 'Error de servidor' });
    }

}

const recoverypass = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const userExist = await User.findOne({
            where: {
                email: email
            }
        })
        if (userExist) {
            const token = jwt.sign({ email: userExist.email }, jwt_secret, { expiresIn: '1h' })
            const recoveryUrl = `${back_url}/user/${token}`

            await transporter.sendMail({
                from: `"Empresa"  <${companyEmail}>`,
                to: userExist.email,
                subject: "CONFIRME SU CUENTA",
                html: `Siga el siguiente link para restablecer su contraseña  ${recoveryUrl}`
            })

            res.status(200).send('Link de recuperación enviado, revisa tu casilla de correo')
        } else {
            res.status(400).send('No hay usuarios con ese email')
        }
    } catch (error) {
        res.status(400).send('server error')

    }
}

const mailValidation = async (req: Request, res: Response) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, jwt_secret) as jwt.JwtPayload;
        let user: User | null = null
        if (decodedToken) {
            user = await User.findOne({
                where: {
                    email: decodedToken.email
                }
            })
        }
        if (user) {
            const newToken = jwt.sign({ email: user.email }, jwt_secret, { expiresIn: '24h' })
            const recoveryPage = `${frontUrl}/recovery`
            res.cookie('token', newToken, {
                expires: expirationDate
            }).redirect(`${recoveryPage}`)

        } else {
            res.status(400).send('Link vencido')
        }
    } catch (error) {
        res.status(500).send('server error')
    }

}

const changePass = async (req: Request, res: Response) => {
    const { pass } = req.body;
    const authorizationHeader = req.headers['authorization'];
    const authorization: string = authorizationHeader || '';

    try {
        const token = authorization.split(" ")[1].replace(/"/g, '');
        const decodedToken: any = jwt.verify(token, jwt_secret);
        const user = await User.findOne({
            where:
            {
                email: decodedToken.email
            }
        })
        if (user) {
            const newPass = bcrypt.hash(pass, 5)
            await user.update({
                pass: newPass
            })

            res.status(200).send('Contraseña cambiada');
        } else {
            res.status(400).send('Email no encontrado')
        }
    } catch (error) {
        res.status(500).json(error)
    }

}



const deleteUser = async (req: Request, res: Response) => {
    const authorizationHeader = req.headers['authorization'];
    const authorization: string = authorizationHeader || '';

    try {
        const token = authorization.split(" ")[1].replace(/"/g, '');
        const payload:any = jwt.verify(token, jwt_secret);
        const userExist = await User.findOne({
            where: {
                id: payload.id
            }
        })
        if (userExist) {
            await User.destroy({
                where: {
                    id: userExist.id
                }
            })
            res.status(200).send('Su cuenta se eleminará en 7 dias')//setear cronjob
        }
    } catch (error) {
        res.status(500).json(error)

    }

}

export default {
    createUser,
    recoverypass,
    mailValidation,
    changePass,
    deleteUser,
}