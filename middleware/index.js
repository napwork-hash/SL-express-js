const validateProduct = (req, res, next) => {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
        console.error("[Data tidak lengkap]");
        return res.status(400).json({
            status: "error",
            message: "Semua data harus diisi",
        });
    }

    next();
}

const parsePrice = (req, res, next) => {
    const price = Number(req.body.price);

    if (req.body.price === undefined || isNaN(price)){
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