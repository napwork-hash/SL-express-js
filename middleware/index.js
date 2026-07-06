import * as z from "zod"

const validateProduct = (req, res, next) => {
    // const { name, price, description } = req.body;

    const productSchema = z.object({
        name: z.string().min(5, "Nama minimal 5 karakter"),
        price: z.coerce.number().min(1, "Harga harus diisi"),
        description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    });

    const result = productSchema.safeParse(req.body);
    if (!result.success) {
        console.error("[Data tidak lengkap]");
        return res.status(400).json({
            status: "error",
            message: result.error.flatten().fieldErrors
        });
    }

    next();
}

const parsePrice = (req, res, next) => {

    if (!req.body.price) {
        return next();
    }

    const price = Number(req.body.price);

    if (req.body.price === undefined || isNaN(price)) {
        console.info("[Price tidak valid]")
        return res.status(400).json({
            status: 'error',
            message: 'Data tidak valid'
        });
    }

    req.body.price = price;
    next();
}

export {
    parsePrice,
    validateProduct
}