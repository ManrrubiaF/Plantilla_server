import { Data } from "../db";
import { Response, Request } from "express";

const createData =async (req:Request, res:Response) => {
    const oneData = req.body
    
    try {
        await Data.create(oneData)
        res.status(201).send('Datos empresariales cargados');
    } catch (error) {
        res.status(500).json(error)
        
    }
}

const updateData = async (req:Request, res:Response) => {
    const { id } = req.body;
    try {
        const dataExist = await Data.findOne({where:{id:id}})
        if(dataExist){
            await dataExist.update(req.body)
            res.status(200).send('Datos actualizados')
        }else{
            res.status(404).send('Ha habido un error, por favor intenta de nuevo')
        }
    } catch (error) {
        res.status(500).json(error)
        
    }
}

const deleteData = async (req:Request,res:Response) => {
    const { id } = req.params;
    try {
        const dataExist = await Data.findByPk(id)
        if(dataExist){
            await dataExist.destroy()
            res.status(200).send('Los datos de la empresa han sido borrados')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export default {
    createData,
    updateData,
    deleteData,
}