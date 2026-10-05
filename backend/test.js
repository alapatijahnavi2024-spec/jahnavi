const request = require("supertest");
const app = require("./server");

describe("Medicine Reminder and Stock Transfer API", () => {

    test("GET / should return API running message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            "Medicine Reminder and Stock Transfer System API is running"
        );
    });

    test("POST /api/medicines should add a medicine", async () => {
        const response = await request(app)
            .post("/api/medicines")
            .send({
                medicineName: "Paracetamol",
                dosage: "500 mg",
                quantity: 10,
                reminderTime: "08:00"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.medicine.medicineName).toBe("Paracetamol");
    });

    test("POST /api/medicines should reject zero quantity", async () => {
        const response = await request(app)
            .post("/api/medicines")
            .send({
                medicineName: "Test Medicine",
                dosage: "100 mg",
                quantity: 0,
                reminderTime: "10:00"
            });

        expect(response.statusCode).toBe(400);
    });

    test("POST /api/stock should add stock", async () => {
        const response = await request(app)
            .post("/api/stock")
            .send({
                medicine: "Paracetamol",
                branch: "Vellore Branch",
                quantity: 25
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.stock.quantity).toBe(25);
    });

    test("POST /api/stock should reject negative quantity", async () => {
        const response = await request(app)
            .post("/api/stock")
            .send({
                medicine: "Paracetamol",
                branch: "Chennai Branch",
                quantity: -5
            });

        expect(response.statusCode).toBe(400);
    });

    test("POST /api/transfers should transfer stock successfully", async () => {
        const response = await request(app)
            .post("/api/transfers")
            .send({
                fromBranch: "Vellore Branch",
                toBranch: "Chennai Branch",
                medicine: "Paracetamol",
                quantity: 5
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.transfer.quantity).toBe(5);
    });

    test("POST /api/transfers should reject insufficient stock", async () => {
        const response = await request(app)
            .post("/api/transfers")
            .send({
                fromBranch: "Vellore Branch",
                toBranch: "Chennai Branch",
                medicine: "Paracetamol",
                quantity: 100
            });

        expect(response.statusCode).toBe(400);
    });

});