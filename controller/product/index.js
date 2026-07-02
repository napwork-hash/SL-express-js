import db from '../../database/index.js'
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../../middleware/errorHandler.js';

const getProducts = asyncHandler(async (req, res) => {
    const product = await db.product.findMany();
    if (product.length <= 0) {
        res.status(200).json({
            status: "success",
            message: "Belum ada data"
        });

        return;
    }

    res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan semua data produk",
        data: product
    });
})

const getProductById = async (req, res) => {
    const { id } = req.params;
    const findId = await db.product.findUnique({
        where: { id }
    })

    if (!findId) {
        console.info("[Produk tidak ditemukan]")
        return res.status(404).json({
            status: "error",
            message: "Produk tidak ditemukan",
        });
    }

    const product = await db.product.findUnique({
        where: { id }
    });

    res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan data produk",
        data: product
    });
}

const createProduct = async (req, res) => {
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
}

const updateProduct = async (req, res) => {
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
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const deleteProduct = await db.product.delete({
        where: { id }
    })

    res.status(200).json({
        status: "success",
        message: `Produk ${id} berhasil dihapus`
    })
}

export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
}