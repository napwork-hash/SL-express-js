import axios from "axios";

const getGempa = async (req, res) => {
    try {
        const responseGempaTerkini = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
        const responseGempa15Terbaru = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json")

        const gempaTerkini = responseGempaTerkini.data.Infogempa.gempa;
        const gempa15Terbaru = responseGempa15Terbaru.data.Infogempa.gempa;

        const data = {
            gempaTerkini: gempaTerkini,
            listGempaTerakhir5SR: gempa15Terbaru
        }

        res.status(200).json({
            status: "success",
            message: "Data gempa berhasil didapatkan",
            data: data
        });
    } catch (err) {
        console.error("[Gagal mendapatkan data gempa]", err);
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

export {
    getGempa
}