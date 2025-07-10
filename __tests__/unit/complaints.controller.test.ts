import { ComplaintController } from "../../src/complaints/complaints.controller";
import { ComplaintService } from "../../src/complaints/complaints.service";
import { Request, Response } from "express";

// Mock the ComplaintService
jest.mock("../../src/complaints/complaints.service");

const mockRes = (): Response => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe("ComplaintController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all complaints", async () => {
    const res = mockRes();
    const mockData = [{ complaintId: 1, userId: 1, message: "Late" }];
    (ComplaintService.getAll as jest.Mock).mockResolvedValue(mockData);

    await ComplaintController.getAll({} as Request, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it("should return complaint by ID", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();
    const mockComplaint = { complaintId: 1, userId: 1, message: "Late" };

    (ComplaintService.getById as jest.Mock).mockResolvedValue(mockComplaint);

    await ComplaintController.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockComplaint);
  });

  it("should return 404 if complaint not found", async () => {
    const req = { params: { id: "99" } } as unknown as Request;
    const res = mockRes();

    (ComplaintService.getById as jest.Mock).mockResolvedValue(null);

    await ComplaintController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Complaint not found" });
  });

  it("should create a complaint", async () => {
    const req = { body: { userId: 1, message: "Broken system" } } as Request;
    const res = mockRes();

    (ComplaintService.create as jest.Mock).mockResolvedValue([
      { complaintId: 10, userId: 1, message: "Broken system" },
    ]);

    await ComplaintController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      complaintId: 10,
      userId: 1,
      message: "Broken system",
    });
  });

  it("should update a complaint", async () => {
    const req = {
      params: { id: "1" },
      body: { message: "Updated complaint" },
    } as unknown as Request;
    const res = mockRes();

    (ComplaintService.update as jest.Mock).mockResolvedValue([
      { complaintId: 1, userId: 1, message: "Updated complaint" },
    ]);

    await ComplaintController.update(req, res);
    expect(res.json).toHaveBeenCalledWith({
      complaintId: 1,
      userId: 1,
      message: "Updated complaint",
    });
  });

  it("should delete a complaint", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();

    await ComplaintController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
