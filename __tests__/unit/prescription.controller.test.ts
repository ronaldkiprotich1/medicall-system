import { PrescriptionController } from "../../src/prescription/prescription.controller";
import { PrescriptionService } from "../../src/prescription/prescription.service";
import { Request, Response } from "express";

jest.mock("../../src/prescription/prescription.service");

const mockRes = (): Response => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe("PrescriptionController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return all prescriptions", async () => {
    const res = mockRes();
    const mockPrescriptions = [{ prescriptionId: 1, medication: "Panadol", dosage: "500mg" }];
    (PrescriptionService.getAll as jest.Mock).mockResolvedValue(mockPrescriptions);

    await PrescriptionController.getAll({} as Request, res);
    expect(res.json).toHaveBeenCalledWith(mockPrescriptions);
  });

  it("should return prescription by ID", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();
    const mockPrescription = { prescriptionId: 1, medication: "Ibuprofen", dosage: "200mg" };

    (PrescriptionService.getById as jest.Mock).mockResolvedValue(mockPrescription);
    await PrescriptionController.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockPrescription);
  });

  it("should return 404 if prescription not found", async () => {
    const req = { params: { id: "99" } } as unknown as Request;
    const res = mockRes();

    (PrescriptionService.getById as jest.Mock).mockResolvedValue(null);
    await PrescriptionController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Prescription not found" });
  });

  it("should create a prescription", async () => {
    const req = {
      body: { medication: "Amoxicillin", dosage: "250mg" },
    } as Request;
    const res = mockRes();
    const created = { prescriptionId: 1, medication: "Amoxicillin", dosage: "250mg" };

    (PrescriptionService.create as jest.Mock).mockResolvedValue([created]);
    await PrescriptionController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  it("should update a prescription", async () => {
    const req = {
      params: { id: "1" },
      body: { medication: "Ibuprofen", dosage: "400mg" },
    } as unknown as Request;
    const res = mockRes();
    const updated = { prescriptionId: 1, medication: "Ibuprofen", dosage: "400mg" };

    (PrescriptionService.update as jest.Mock).mockResolvedValue([updated]);
    await PrescriptionController.update(req, res);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("should delete a prescription", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();

    await PrescriptionController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
