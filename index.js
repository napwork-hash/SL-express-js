import express from "express";
import routes from "./routes/index.js"
import db from "./database/index.js"; // init awal koneksi ke database
import { errorHandler, errorNotFound } from "./middleware/errorHandler.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/", routes);

app.use(errorNotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
