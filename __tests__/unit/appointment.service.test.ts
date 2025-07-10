import { AppointmentService } from '../../src/appointment/appointment.service';
import { db, appointments } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

// Mock the db and its methods
jest.mock('../Drizzle/db', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(),
    })),
    query: {
      appointments: {
        findFirst: jest.fn(),
      },
    },
    insert: jest.fn(() => ({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    })),
    update: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    })),
    delete: jest.fn(() => ({
      where: jest.fn(),
    })),
  },
  appointments: {
    appointmentId: 'appointmentId', // simplified mock
    $inferInsert: {} as any,
  },
}));

describe('AppointmentService', () => {
  const mockAppointment = {
    appointmentId: 1,
    userId: 1,
    doctorId: 1,
    appointmentDate: '2025-07-10T10:00:00Z',
    status: 'Scheduled',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll - should return all appointments', async () => {
    const mockSelect = jest.fn().mockResolvedValue([mockAppointment]);
    (db.select as jest.Mock).mockReturnValue({ from: mockSelect });

    const result = await AppointmentService.getAll();

    expect(db.select).toHaveBeenCalled();
    expect(result).toEqual([mockAppointment]);
  });

  test('getById - should return one appointment', async () => {
    (db.query.appointments.findFirst as jest.Mock).mockResolvedValue(mockAppointment);

    const result = await AppointmentService.getById(1);

    expect(db.query.appointments.findFirst).toHaveBeenCalledWith({ where: eq('appointmentId', 1) });
    expect(result).toEqual(mockAppointment);
  });

  test('create - should insert appointment and return it', async () => {
    const returning = jest.fn().mockResolvedValue([mockAppointment]);
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({ returning }),
    });

    const result = await AppointmentService.create(mockAppointment);

    expect(result).toEqual([mockAppointment]);
    expect(db.insert).toHaveBeenCalledWith(appointments);
  });

  test('update - should update appointment and return updated value', async () => {
    const returning = jest.fn().mockResolvedValue([mockAppointment]);
    const where = jest.fn().mockReturnValue({ returning });
    const set = jest.fn().mockReturnValue({ where });
    (db.update as jest.Mock).mockReturnValue({ set });

    const result = await AppointmentService.update(1, { status: 'Completed' });

    expect(result).toEqual([mockAppointment]);
    expect(db.update).toHaveBeenCalledWith(appointments);
  });

  test('delete - should delete appointment', async () => {
    const where = jest.fn();
    (db.delete as jest.Mock).mockReturnValue({ where });

    await AppointmentService.delete(1);

    expect(db.delete).toHaveBeenCalledWith(appointments);
    expect(where).toHaveBeenCalledWith(eq('appointmentId', 1));
  });
});
