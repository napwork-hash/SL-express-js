import db from '../../database/index.js'
import { v4 as uuidv4 } from 'uuid';

const getProducts = async (req, res) => {
    try {
        const product = await db.product.findMany();
        res.status(200).json({
            status: "success",
            message: "Berhasil mendapatkan semua data produk",
            data: product
        });
    } catch (err) {
        console.error("[Data produk tidak dapat diambil]", err);
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const newProduct = await db.product.create({
            data: {
                id: "product-" + uuidv4(),
                name,
                price: Number(price),
                description,
            }
        });
        res.status(201).json({
            status: "success",
            message: "Produk berhasil ditambahkan",
            data: newProduct
        });
    } catch (err) {
        console.error("[Data produk tidak dapat disimpan]", err);
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        const findId = await db.product.findUnique({
            where: { id }
        });

        if (!findId) {
            console.info("[Produk tidak ditemukan]")
            return res.status(404).json({
                status: "error",
                message: "Produk tidak ditemukan",
            });
        }

        const updateProduct = await db.product.update({
            where: { id },
            data: {
                name,
                price: price ? Number(price) : undefined,
                description,
            },
        })

        res.status(200).json({
            status: "success",
            message: "Produk berhasil diupdate",
            data: updateProduct
        })

    } catch (err) {
        console.error("[Gagal update produk]", err);
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProduct = await db.product.delete({
            where: { id }
        })

        res.status(200).json({
            status: "success",
            message: `Produk ${id} berhasil dihapus`
        })
    } catch (err) {
        console.error("[Gagal delete produk]", err);
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }

}

export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}