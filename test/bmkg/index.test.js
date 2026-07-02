import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

import axios from "axios";
import { getGempa } from "../../controller/bmkg/index.js";

function mockRes() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getGempa", () => {
    it("mengembalikan 200 beserta data gempa terkini dan daftar gempa terbaru saat berhasil", async () => {
        const gempaTerkini = { Tanggal: "02 Jul 2026", Magnitude: "5.0" };
        const gempa15Terbaru = [{ Tanggal: "01 Jul 2026" }, { Tanggal: "30 Jun 2026" }];

        axios.get
            .mockResolvedValueOnce({ data: { Infogempa: { gempa: gempaTerkini } } })
            .mockResolvedValueOnce({ data: { Infogempa: { gempa: gempa15Terbaru } } });

        const res = mockRes();

        await getGempa({}, res);

        expect(axios.get).toHaveBeenNthCalledWith(
            1,
            "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
        );
        expect(axios.get).toHaveBeenNthCalledWith(
            2,
            "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json"
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Data gempa berhasil didapatkan",
            data: {
                gempaTerkini,
                listGempaTerakhir5SR: gempa15Terbaru,
            },
        });
    });

    it("mengembalikan 500 saat request gempa terkini gagal", async () => {
        axios.get.mockRejectedValueOnce(new Error("network error"));
        const res = mockRes();

        await getGempa({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "network error",
        });
    });

    it("mengembalikan 500 saat request daftar gempa terbaru gagal", async () => {
        axios.get
            .mockResolvedValueOnce({ data: { Infogempa: { gempa: {} } } })
            .mockRejectedValueOnce(new Error("gempaterkini failed"));
        const res = mockRes();

        await getGempa({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "gempaterkini failed",
        });
    });
});
