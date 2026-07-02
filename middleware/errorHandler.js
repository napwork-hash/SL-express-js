const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
        status: "error",
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    })
}

const errorNotFound = (req, res, next) => {
    const route = req.originalUrl

    console.info(`Route ${route} not found`)

    res.status(404).json({
        status: "error",
        message: `Route ${route} tidak ditemukan`
    })
}

const asyncHandler = (fn => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
})

export {
    errorHandler,
    asyncHandler,
    errorNotFound
}