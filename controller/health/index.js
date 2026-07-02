import db from '../../database/index.js'
import { asyncHandler } from '../../middleware/errorHandler.js';

const healthCheck = asyncHandler(async (req, res) => {
    await db.$queryRaw`SELECT 1`;

    res.status(200).json({
        status: "success",
        message: "Server is healthy",
        data: {
            timestamp: new Date().toISOString(),
            database: "connected",
        },
    });
})

export {
    healthCheck
}