import express from "express";
import routes from "./routes/index.js"
import db from "./database/index.js"; // init awal koneksi ke database

const app = express();
const port = 3000;

app.use(express.json());
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
