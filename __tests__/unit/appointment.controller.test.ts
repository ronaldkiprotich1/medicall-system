import { AppointmentController } from "../../src/appointment/appointment.controller";
import { AppointmentService } from "../../src/appointment/appointment.service";
import { Request, Response } from "express";

// Mock the AppointmentService
jest.mock("../../src/appointment/appointment.service");

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe("AppointmentController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all appointments", async () => {
      const res = mockResponse();
      const mockAppointments = [{ appointmentId: 1 }, { appointmentId: 2 }];
      (AppointmentService.getAll as jest.Mock).mockResolvedValue(mockAppointments);

      await AppointmentController.getAll({} as Request, res);
      expect(AppointmentService.getAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockAppointments);
    });
  });

  describe("getById", () => {
    it("should return appointment if found", async () => {
      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockResponse();
      const appointment = { appointmentId: 1 };

      (AppointmentService.getById as jest.Mock).mockResolvedValue(appointment);

      await AppointmentController.getById(req, res);
      expect(AppointmentService.getById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith(appointment);
    });

    it("should return 404 if appointment not found", async () => {
      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockResponse();

      (AppointmentService.getById as jest.Mock).mockResolvedValue(null);

      await AppointmentController.getById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Appointment not found" });
    });
  });

  describe("create", () => {
    it("should create and return appointment", async () => {
      const req = { body: { patientId: 1 } } as Request;
      const res = mockResponse();
      const mockCreated = [{ appointmentId: 10, patientId: 1 }];

      (AppointmentService.create as jest.Mock).mockResolvedValue(mockCreated);

      await AppointmentController.create(req, res);
      expect(AppointmentService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreated[0]);
    });
  });

  describe("update", () => {
    it("should update and return the updated appointment", async () => {
      const req = { params: { id: "2" }, body: { doctorId: 3 } } as unknown as Request;
      const res = mockResponse();
      const mockUpdated = [{ appointmentId: 2, doctorId: 3 }];

      (AppointmentService.update as jest.Mock).mockResolvedValue(mockUpdated);

      await AppointmentController.update(req, res);
      expect(AppointmentService.update).toHaveBeenCalledWith(2, req.body);
      expect(res.json).toHaveBeenCalledWith(mockUpdated[0]);
    });
  });

  describe("delete", () => {
    it("should delete an appointment and return 204", async () => {
      const req = { params: { id: "5" } } as unknown as Request;
      const res = mockResponse();

      (AppointmentService.delete as jest.Mock).mockResolvedValue(undefined);

      await AppointmentController.delete(req, res);
      expect(AppointmentService.delete).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
