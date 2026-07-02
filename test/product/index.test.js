import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../database/index.js", () => ({
    default: {
        product: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

vi.mock("uuid", () => ({
    v4: () => "mocked-uuid",
}));

import db from "../../database/index.js";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../controller/product/index.js";

function mockRes() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe("getProducts", () => {
    it("mengembalikan 200 beserta daftar produk saat berhasil", async () => {
        const products = [{ id: "product-1", name: "Kopi" }];
        db.product.findMany.mockResolvedValue(products);
        const res = mockRes();
        const next = vi.fn();

        await getProducts({}, res, next);
        await vi.waitFor(() => expect(res.json).toHaveBeenCalled());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Berhasil mendapatkan semua data produk",
            data: products,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("mengembalikan 200 beserta pesan 'Belum ada data' tanpa field data saat produk kosong", async () => {
        db.product.findMany.mockResolvedValue([]);
        const res = mockRes();
        const next = vi.fn();

        await getProducts({}, res, next);
        await vi.waitFor(() => expect(res.json).toHaveBeenCalled());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Belum ada data",
        });
    });

    it("meneruskan error ke next saat pemanggilan database gagal", async () => {
        const error = new Error("db error");
        db.product.findMany.mockRejectedValue(error);
        const res = mockRes();
        const next = vi.fn();

        await getProducts({}, res, next);
        await vi.waitFor(() => expect(next).toHaveBeenCalled());

        expect(next).toHaveBeenCalledWith(error);
        expect(res.status).not.toHaveBeenCalled();
    });
});

describe("getProductById", () => {
    it("mengembalikan 200 beserta data produk saat ditemukan", async () => {
        const req = { params: { id: "product-1" } };
        const product = { id: "product-1", name: "Kopi" };
        db.product.findUnique.mockResolvedValue(product);
        const res = mockRes();

        await getProductById(req, res);

        expect(db.product.findUnique).toHaveBeenCalledWith({
            where: { id: "product-1" },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Berhasil mendapatkan data produk",
            data: product,
        });
    });

    it("mengembalikan 404 saat produk tidak ditemukan", async () => {
        const req = { params: { id: "product-tidak-ada" } };
        db.product.findUnique.mockResolvedValue(null);
        const res = mockRes();

        await getProductById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "Produk tidak ditemukan",
        });
    });

    it("melempar error saat pemanggilan database gagal", async () => {
        const req = { params: { id: "product-1" } };
        db.product.findUnique.mockRejectedValue(new Error("find failed"));
        const res = mockRes();

        await expect(getProductById(req, res)).rejects.toThrow("find failed");
        expect(res.status).not.toHaveBeenCalled();
    });
});

describe("createProduct", () => {
    it("membuat produk dan mengembalikan 201 saat berhasil", async () => {
        const req = {
            body: { name: "Kopi", price: "15000", description: "Kopi hitam" },
        };
        const created = {
            id: "product-mocked-uuid",
            name: "Kopi",
            price: 15000,
            description: "Kopi hitam",
        };
        db.product.create.mockResolvedValue(created);
        const res = mockRes();

        await createProduct(req, res);

        expect(db.product.create).toHaveBeenCalledWith({
            data: {
                id: "product-mocked-uuid",
                name: "Kopi",
                price: 15000,
                description: "Kopi hitam",
            },
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Produk berhasil ditambahkan",
            data: created,
        });
    });

    it("melempar error saat pemanggilan database gagal", async () => {
        const req = { body: { name: "Kopi", price: "15000", description: "x" } };
        db.product.create.mockRejectedValue(new Error("create failed"));
        const res = mockRes();

        await expect(createProduct(req, res)).rejects.toThrow("create failed");
        expect(res.status).not.toHaveBeenCalled();
    });
});

describe("updateProduct", () => {
    it("memperbarui produk dan mengembalikan 200 saat berhasil", async () => {
        const req = {
            params: { id: "product-1" },
            body: { name: "Kopi Susu", price: "20000" },
        };
        const updated = { id: "product-1", name: "Kopi Susu", price: 20000 };
        db.product.findUnique.mockResolvedValue({ id: "product-1" });
        db.product.update.mockResolvedValue(updated);
        const res = mockRes();

        await updateProduct(req, res);

        expect(db.product.findUnique).toHaveBeenCalledWith({
            where: { id: "product-1" },
        });
        expect(db.product.update).toHaveBeenCalledWith({
            where: { id: "product-1" },
            data: {
                name: "Kopi Susu",
                price: 20000,
                description: undefined,
            },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Produk berhasil diupdate",
            data: updated,
        });
    });

    it("membiarkan price undefined jika tidak diberikan", async () => {
        const req = { params: { id: "product-1" }, body: { name: "Kopi Susu" } };
        db.product.findUnique.mockResolvedValue({ id: "product-1" });
        db.product.update.mockResolvedValue({});
        const res = mockRes();

        await updateProduct(req, res);

        expect(db.product.update).toHaveBeenCalledWith({
            where: { id: "product-1" },
            data: {
                name: "Kopi Susu",
                price: undefined,
                description: undefined,
            },
        });
    });

    it("mengembalikan 404 saat produk tidak ditemukan", async () => {
        const req = { params: { id: "product-tidak-ada" }, body: { name: "Kopi Susu" } };
        db.product.findUnique.mockResolvedValue(null);
        const res = mockRes();

        await updateProduct(req, res);

        expect(db.product.update).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: "error",
            message: "Produk tidak ditemukan",
        });
    });

    it("melempar error saat pemanggilan database gagal", async () => {
        const req = { params: { id: "product-1" }, body: {} };
        db.product.findUnique.mockResolvedValue({ id: "product-1" });
        db.product.update.mockRejectedValue(new Error("update failed"));
        const res = mockRes();

        await expect(updateProduct(req, res)).rejects.toThrow("update failed");
        expect(res.status).not.toHaveBeenCalled();
    });
});

describe("deleteProduct", () => {
    it("mengembalikan 200 beserta pesan konfirmasi saat berhasil", async () => {
        const req = { params: { id: "product-1" } };
        db.product.delete.mockResolvedValue({ id: "product-1" });
        const res = mockRes();

        await deleteProduct(req, res);

        expect(db.product.delete).toHaveBeenCalledWith({
            where: { id: "product-1" },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: "success",
            message: "Produk product-1 berhasil dihapus",
        });
    });

    it("melempar error saat pemanggilan database gagal", async () => {
        const req = { params: { id: "product-1" } };
        db.product.delete.mockRejectedValue(new Error("delete failed"));
        const res = mockRes();

        await expect(deleteProduct(req, res)).rejects.toThrow("delete failed");
        expect(res.status).not.toHaveBeenCalled();
    });
});
