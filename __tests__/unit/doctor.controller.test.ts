import { DoctorController } from "../../src/doctor/doctor.controller";
import { DoctorService } from "../../src/doctor/doctor.service";
import { Request, Response } from "express";

jest.mock("../../src/doctor/doctor.service");

const mockRes = (): Response => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe("DoctorController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all doctors", async () => {
    const res = mockRes();
    const mockDoctors = [{ doctorId: 1, name: "Dr. A", specialty: "ENT" }];
    (DoctorService.getAll as jest.Mock).mockResolvedValue(mockDoctors);

    await DoctorController.getAll({} as Request, res);
    expect(res.json).toHaveBeenCalledWith(mockDoctors);
  });

  it("should return doctor by ID", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();
    const mockDoctor = { doctorId: 1, name: "Dr. Bob", specialty: "Orthopedic" };

    (DoctorService.getById as jest.Mock).mockResolvedValue(mockDoctor);
    await DoctorController.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockDoctor);
  });

  it("should return 404 if doctor not found", async () => {
    const req = { params: { id: "99" } } as unknown as Request;
    const res = mockRes();

    (DoctorService.getById as jest.Mock).mockResolvedValue(null);
    await DoctorController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Doctor not found" });
  });

  it("should create a doctor", async () => {
    const req = { body: { name: "Dr. Alice", specialty: "Cardiology" } } as Request;
    const res = mockRes();
    const mockDoctor = { doctorId: 1, name: "Dr. Alice", specialty: "Cardiology" };

    (DoctorService.create as jest.Mock).mockResolvedValue([mockDoctor]);
    await DoctorController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockDoctor);
  });

  it("should update a doctor", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Dr. Alice Updated", specialty: "Neurology" },
    } as unknown as Request;
    const res = mockRes();
    const updatedDoctor = {
      doctorId: 1,
      name: "Dr. Alice Updated",
      specialty: "Neurology",
    };

    (DoctorService.update as jest.Mock).mockResolvedValue([updatedDoctor]);
    await DoctorController.update(req, res);
    expect(res.json).toHaveBeenCalledWith(updatedDoctor);
  });

  it("should delete a doctor", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();

    await DoctorController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
