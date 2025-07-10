import { AppointmentService } from "../../src/appointment/appointment.service";
import { db, appointments } from "../../src/Drizzle/db";
import { eq } from "drizzle-orm";

// Mock db module
jest.mock("../../src/Drizzle/db", () => ({
  __esModule: true,
  db: {
    select: jest.fn(() => ({
      from: jest.fn().mockResolvedValue([
        {
          appointmentId: 1,
          userId: 1,
          doctorId: 2,
          appointmentDate: "2025-07-10",
          timeSlot: "09:00 AM - 10:00 AM"
        }
      ]),
    })),
    query: {
      appointments: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(() => ({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        {
          appointmentId: 2,
          userId: 1,
          doctorId: 2,
          appointmentDate: "2025-07-11",
          timeSlot: "10:00 AM - 11:00 AM"
        }
      ]),
    })),
    update: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        {
          appointmentId: 1,
          userId: 1,
          doctorId: 3,
          appointmentDate: "2025-07-12",
          timeSlot: "02:00 PM - 03:00 PM"
        }
      ]),
    })),
    delete: jest.fn(() => ({
      where: jest.fn().mockResolvedValue({ success: true }),
    })),
  },
  appointments: {
    appointmentId: Symbol("appointmentId"),
  },
}));

describe("AppointmentService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all appointments", async () => {
    const result = await AppointmentService.getAll();
    expect(result).toEqual([
      {
        appointmentId: 1,
        userId: 1,
        doctorId: 2,
        appointmentDate: "2025-07-10",
        timeSlot: "09:00 AM - 10:00 AM"
      }
    ]);
  });

  it("should get appointment by ID", async () => {
    const mockAppointment = {
      appointmentId: 1,
      userId: 1,
      doctorId: 2,
      appointmentDate: "2025-07-10",
      timeSlot: "09:00 AM - 10:00 AM"
    };
    (db.query.appointments.findFirst as jest.Mock).mockResolvedValue(mockAppointment);

    const result = await AppointmentService.getById(1);
    expect(db.query.appointments.findFirst).toHaveBeenCalledWith({
      where: eq(appointments.appointmentId, 1),
    });
    expect(result).toEqual(mockAppointment);
  });

  it("should create a new appointment", async () => {
    const data = {
      userId: 1,
      doctorId: 2,
      appointmentDate: "2025-07-11",
      timeSlot: "10:00 AM - 11:00 AM"
    };

    const result = await AppointmentService.create(data as any);
    expect(result).toEqual([
      {
        appointmentId: 2,
        userId: 1,
        doctorId: 2,
        appointmentDate: "2025-07-11",
        timeSlot: "10:00 AM - 11:00 AM"
      }
    ]);
  });

  it("should update an appointment", async () => {
    const data = {
      doctorId: 3,
      appointmentDate: "2025-07-12",
      timeSlot: "02:00 PM - 03:00 PM"
    };

    const result = await AppointmentService.update(1, data);
    expect(result).toEqual([
      {
        appointmentId: 1,
        userId: 1,
        doctorId: 3,
        appointmentDate: "2025-07-12",
        timeSlot: "02:00 PM - 03:00 PM"
      }
    ]);
  });

  it("should delete an appointment", async () => {
    const result = await AppointmentService.delete(1);
    expect(result).toEqual({ success: true });
  });
});
