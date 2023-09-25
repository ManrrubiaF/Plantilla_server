import { Product } from "../db";
import { Response, Request } from "express";


const createProduct = async (req: Request, res: Response) => {
    const oneProduct = req.body
    
    try {
        const productExist = await Product.findOne({
            where:{
                name: oneProduct.name
            }
        })
        if(!productExist){
            await Product.create(oneProduct)
            res.status(201).send('Producto añadido')
        }else{
            res.status(400).send('Producto existente, revisa el stock')
        }
    } catch (error) {
        res.status(500).json(error)        
    }
}

const updateProduct = async (req:Request, res: Response) => {
    const data = req.body;
    
    try {
        const productExist = await Product.findOne({
            where:{
                name: data.id
            }
        })
        if(productExist){
            await productExist.update(data)
            res.status(200).send('Producto actualizado')
        }else{
            res.status(404).send('Hubo un error al encontrar el producto')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteProduct = async (req:Request, res: Response) => {
    const  { id } = req.params
    try {
        const productExist = await Product.findByPk(id)
        if(productExist){
            await productExist.destroy()
            res.status(200).send('El producto se eliminará en 7 dias')//setear cronjob
        }else{
            res.status(404).send('Hubo un error al buscar el producto')
        }
    } catch (error) {
        res.status(500).send('server error')
        
    }
}

export default {
    createProduct,
    updateProduct,
    deleteProduct

} 