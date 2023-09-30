import axios from "axios";
import { Product,Data, ProductDetail } from "../db";

async function firstload() {
    const response = await axios.get('http://localhost:5000/products');
    const products = response.data;
    const dataResponse = await axios.get('http://localhost:5000/data');
    const data = dataResponse.data

    try {
        for (const product of products) {

            const {
                price,
                name,
                description,
                active,
                category,
                details
            } = product
            const productCreated = await Product.create({
                price,
                name,
                description,
                active,
                category
            })
            for (const oneDetail of details) {
                await ProductDetail.create({
                    color: oneDetail.color,
                    stock: oneDetail.stock,
                    image: oneDetail.image,
                    productId: productCreated.id
                })
            }
        }
        for(const oneData of data){
            await Data.create(oneData)
        }
        console.log( "Data embedded successfully")
    } catch (error) {
        console.error('failed to load api', error)

    }

}

export default firstload;