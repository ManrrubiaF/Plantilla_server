import { Product, ProductDetail } from "../db";
import { Response, Request } from "express";


const createProduct = async (req: Request, res: Response) => {
    const oneProduct = req.body

    try {
        const productExist = await Product.findOne({
            where: {
                name: oneProduct.name
            }
        })
        if (!productExist) {
            const productCreated = await Product.create({
                price: oneProduct.price,
                name: oneProduct.name,
                description: oneProduct.description,
                active: oneProduct.active,
                category: oneProduct.category,
            })
            for (const oneColor of oneProduct.detail) {
                await ProductDetail.create({
                    color: oneColor.color,
                    stock: oneColor.stock,
                    image: oneColor.image,
                    productId: productCreated.id
                })
            }
            res.status(201).send('Producto añadido')
        } else {
            res.status(400).send('Producto existente, revisa el stock')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateProduct = async (req: Request, res: Response) => {
    const data = req.body;
    const { id } = req.params;

    try {
        const productExist: Product | null = await Product.findOne({
            where: {
                id: id
            }
        })

        if (productExist) {
            const updateData: Record<string, any> = {}
            const detailData: Record<string, any> = {}

            for (const key in data) {
                if (key === 'detail') {
                    const detail = data[key];
                    for (const detailKey in detail) {
                        detailData[detailKey] = detail[detailKey];
                        const existingDetail = await ProductDetail.findOne({
                            where: {
                                productId: productExist.id,
                                color: detail.color
                            }
                        });
                        await existingDetail?.update(detailData)
                    }
                } else {
                    updateData[key] = data[key];
                }

            }

            await productExist.update(updateData)
            res.status(200).send('Producto actualizado')
        } else {
            res.status(404).send('Hubo un error al encontrar el producto')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const productExist = await Product.findByPk(id)
        if (productExist) {
            await productExist.destroy()
            res.status(200).send('El producto se eliminará en 7 dias')//setear cronjob
        } else {
            res.status(404).send('Hubo un error al buscar el producto')
        }
    } catch (error) {
        res.status(500).send('server error')

    }
}

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            include: ProductDetail
        })
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getProductById =async (req:Request, res:Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({
            where:{
                id: id,

            },
            include:ProductDetail
        })
        if(product){
            res.status(200).json(product)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

export default {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,

} 