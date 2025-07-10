import { ComplaintService } from "../../src/complaints/complaints.service";
import { db, complaints } from "../../src/Drizzle/db";
import { eq } from "drizzle-orm";

jest.mock("../../src/Drizzle/db", () => ({
  __esModule: true,
  db: {
    select: jest.fn(() => ({
      from: jest.fn().mockResolvedValue([
        {
          complaintId: 1,
          userId: 1,
          subject: "Late Appointment",
          description: "Doctor arrived 1 hour late",
        },
      ]),
    })),
    query: {
      complaints: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(() => ({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        {
          complaintId: 2,
          userId: 2,
          subject: "Unprofessional Behavior",
          description: "Doctor was rude during consultation",
        },
      ]),
    })),
    update: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        {
          complaintId: 1,
          userId: 1,
          subject: "Updated Subject",
          description: "Updated description",
        },
      ]),
    })),
    delete: jest.fn(() => ({
      where: jest.fn().mockResolvedValue({ success: true }),
    })),
  },
  complaints: {
    complaintId: Symbol("complaintId"),
  },
}));

describe("ComplaintService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all complaints", async () => {
    const result = await ComplaintService.getAll();
    expect(result).toEqual([
      {
        complaintId: 1,
        userId: 1,
        subject: "Late Appointment",
        description: "Doctor arrived 1 hour late",
      },
    ]);
  });

  it("should return complaint by ID", async () => {
    const mockComplaint = {
      complaintId: 1,
      userId: 1,
      subject: "Late Appointment",
      description: "Doctor arrived 1 hour late",
    };
    (db.query.complaints.findFirst as jest.Mock).mockResolvedValue(mockComplaint);

    const result = await ComplaintService.getById(1);
    expect(result).toEqual(mockComplaint);
  });

  it("should create a complaint", async () => {
    const data = {
      userId: 2,
      subject: "Unprofessional Behavior",
      description: "Doctor was rude during consultation",
    };

    const result = await ComplaintService.create(data as any);
    expect(result).toEqual([
      {
        complaintId: 2,
        userId: 2,
        subject: "Unprofessional Behavior",
        description: "Doctor was rude during consultation",
      },
    ]);
  });

  it("should update a complaint", async () => {
    const data = {
      subject: "Updated Subject",
      description: "Updated description",
    };

    const result = await ComplaintService.update(1, data);
    expect(result).toEqual([
      {
        complaintId: 1,
        userId: 1,
        subject: "Updated Subject",
        description: "Updated description",
      },
    ]);
  });

  it("should delete a complaint", async () => {
    const result = await ComplaintService.delete(1);
    expect(result).toEqual({ success: true });
  });
});
