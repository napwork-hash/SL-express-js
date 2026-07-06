import db from '../../database/index.js'
import { v4 as uuidv4 } from 'uuid';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { sortProduct, searchProduct } from '../../utility/product.js';

const getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const maxLimit = 100;
    const skip = (page - 1) * limit;

    const orderBy = sortProduct(req.query?.sortBy, req.query?.orderBy);
    const search = searchProduct(req.query?.search);

    const [product, totalItems] = await Promise.all([
        db.product.findMany({
            skip,
            take: Math.min(limit, maxLimit),
            orderBy: orderBy,
            where: search
        }),
        db.product.count({where: search})
    ]);

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
        data: product,
        pagination: {
            page,
            limit: limit > maxLimit ? maxLimit : limit,
            total_items: product.length,
            total_data: totalItems,
            total_pages: Math.ceil(totalItems / maxLimit)
        }
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

    const findId = await db.product.findUnique({
        where: { id }
    });

    if (!findId) {
        console.info("[Produk tidak ditemukan]");
        return res.status(404).json({
            status: "error",
            message: "Produk tidak ditemukan",
        });
    }

    const deleteProduct = await db.product.delete({
        where: { id }
    })

    res.status(200).json({
        status: "success",
        message: `Produk berhasil dihapus`,
        data: {
            id: findId.id,
            name: findId.name,
            price: findId.price,
            description: findId.description
        }
    })
}

export {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById
}