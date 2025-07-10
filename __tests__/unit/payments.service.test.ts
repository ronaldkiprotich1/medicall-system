import { PaymentService } from "../../src/payments/payments.service";
import { db } from "../../src/Drizzle/db";

jest.mock("../../src/Drizzle/db", () => ({
  __esModule: true,
  db: {
    select: jest.fn(() => ({
      from: jest.fn().mockResolvedValue([
        { paymentId: 1, amount: "100", paymentMethod: "Cash" },
      ]),
    })),
    query: {
      payments: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(() => ({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        { paymentId: 2, amount: "200", paymentMethod: "Card" },
      ]),
    })),
    update: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        { paymentId: 1, amount: "300", paymentMethod: "Mpesa" },
      ]),
    })),
    delete: jest.fn(() => ({
      where: jest.fn().mockResolvedValue({ success: true }),
    })),
  },
}));

describe("PaymentService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all payments", async () => {
    const result = await PaymentService.getAll();
    expect(result).toEqual([
      { paymentId: 1, amount: "100", paymentMethod: "Cash" },
    ]);
  });

  it("should return payment by ID", async () => {
    const mockPayment = { paymentId: 1, amount: "150", paymentMethod: "Card" };
    (db.query.payments.findFirst as jest.Mock).mockResolvedValue(mockPayment);

    const result = await PaymentService.getById(1);
    expect(result).toEqual(mockPayment);
  });

  it("should return null if payment not found", async () => {
    (db.query.payments.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await PaymentService.getById(99);
    expect(result).toBeNull();
  });

  it("should create a payment", async () => {
    const data = { amount: "200", paymentMethod: "Card" };
    const result = await PaymentService.create(data as any);
    expect(result).toEqual([
      { paymentId: 2, amount: "200", paymentMethod: "Card" },
    ]);
  });

  it("should update a payment", async () => {
    const data = { amount: "300", paymentMethod: "Mpesa" };
    const result = await PaymentService.update(1, data);
    expect(result).toEqual([
      { paymentId: 1, amount: "300", paymentMethod: "Mpesa" },
    ]);
  });

  it("should delete a payment", async () => {
    const result = await PaymentService.delete(1);
    expect(result).toEqual({ success: true });
  });
});
