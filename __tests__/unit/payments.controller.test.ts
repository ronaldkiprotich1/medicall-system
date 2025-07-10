import { PaymentController } from "../../src/payments/payments.controller";
import { PaymentService } from "../../src/payments/payments.service";
import { Request, Response } from "express";

jest.mock("../../src/payments/payments.service");

const mockRes = (): Response => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe("PaymentController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return all payments", async () => {
    const res = mockRes();
    const mockPayments = [{ paymentId: 1, amount: 100, method: "Cash" }];
    (PaymentService.getAll as jest.Mock).mockResolvedValue(mockPayments);

    await PaymentController.getAll({} as Request, res);
    expect(res.json).toHaveBeenCalledWith(mockPayments);
  });

  it("should return payment by ID", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();
    const mockPayment = { paymentId: 1, amount: 150, method: "Mpesa" };

    (PaymentService.getById as jest.Mock).mockResolvedValue(mockPayment);
    await PaymentController.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockPayment);
  });

  it("should return 404 if payment not found", async () => {
    const req = { params: { id: "99" } } as unknown as Request;
    const res = mockRes();

    (PaymentService.getById as jest.Mock).mockResolvedValue(null);
    await PaymentController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Payment not found" });
  });

  it("should create a payment", async () => {
    const req = {
      body: { amount: 200, method: "Card" },
    } as Request;
    const res = mockRes();
    const mockPayment = { paymentId: 1, amount: 200, method: "Card" };

    (PaymentService.create as jest.Mock).mockResolvedValue([mockPayment]);
    await PaymentController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockPayment);
  });

  it("should update a payment", async () => {
    const req = {
      params: { id: "1" },
      body: { amount: 250, method: "Card" },
    } as unknown as Request;
    const res = mockRes();
    const updated = { paymentId: 1, amount: 250, method: "Card" };

    (PaymentService.update as jest.Mock).mockResolvedValue([updated]);
    await PaymentController.update(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("should delete a payment", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();

    await PaymentController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
