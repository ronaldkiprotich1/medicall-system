import { PrescriptionService } from '../../src/prescription/prescription.service';
import { db, prescriptions } from '../../src/Drizzle/db';
import { eq } from 'drizzle-orm';

// Mock Drizzle ORM db methods with proper chaining and argument handling
jest.mock('../../src/Drizzle/db', () => {
  const mockBuilder = () => ({
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue(['mocked_return']),
  });

  return {
    db: {
      select: jest.fn().mockReturnThis(),
      from: jest.fn(),
      query: {
        prescriptions: {
          findFirst: jest.fn(),
        },
      },
      insert: jest.fn().mockImplementation(() => mockBuilder()),
      update: jest.fn().mockImplementation(() => mockBuilder()),
      delete: jest.fn().mockImplementation(() => mockBuilder()),
    },
    prescriptions: {},
    eq: jest.requireActual('drizzle-orm').eq,
  };
});

describe('PrescriptionService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all prescriptions', async () => {
      const mockPrescriptions = [{ prescriptionId: 1, medications: 'Drug A', doctorId: 1, appointmentId: 1, patientId: 1 }];
      (db.select as jest.Mock).mockReturnValue({ from: jest.fn().mockResolvedValue(mockPrescriptions) });

      const result = await PrescriptionService.getAll();

      expect(result).toEqual(mockPrescriptions);
      expect(db.select).toHaveBeenCalled();
      expect(db.select().from).toHaveBeenCalledWith(prescriptions);
    });
  });

  describe('getById', () => {
    it('should return a prescription by id', async () => {
      const mockPrescription = { prescriptionId: 1, medications: 'Drug A', doctorId: 1, appointmentId: 1, patientId: 1 };
      (db.query.prescriptions.findFirst as jest.Mock).mockResolvedValue(mockPrescription);

      const result = await PrescriptionService.getById(1);

      expect(result).toEqual(mockPrescription);
      expect(db.query.prescriptions.findFirst).toHaveBeenCalledWith({ where: eq(prescriptions.prescriptionId, 1) });
    });
  });

  describe('create', () => {
    it('should create a new prescription and return it', async () => {
      const newPrescription = {
        doctorId: 1,
        appointmentId: 10,
        patientId: 5,
        medications: 'Drug B',
        dosage: '10mg',
        notes: 'Take after meals',
        instructions: 'Twice a day',
      };
      const createdPrescription = [{ prescriptionId: 2, ...newPrescription }];

      const insertBuilder = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(createdPrescription),
      };
      (db.insert as jest.Mock).mockReturnValue(insertBuilder);

      const result = await PrescriptionService.create(newPrescription);

      expect(result).toEqual(createdPrescription);
      expect(db.insert).toHaveBeenCalledWith(prescriptions);
      expect(insertBuilder.values).toHaveBeenCalledWith(newPrescription);
      expect(insertBuilder.returning).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a prescription and return the updated prescription', async () => {
      const updatedPrescription = [{ prescriptionId: 1, medications: 'Drug C', doctorId: 1, appointmentId: 1, patientId: 1 }];

      const updateBuilder = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue(updatedPrescription),
      };
      (db.update as jest.Mock).mockReturnValue(updateBuilder);

      const updateData = {
        medications: 'Drug C',
        dosage: '20mg',
      };

      const result = await PrescriptionService.update(1, updateData);

      expect(result).toEqual(updatedPrescription);
      expect(db.update).toHaveBeenCalledWith(prescriptions);
      expect(updateBuilder.set).toHaveBeenCalledWith(updateData);
      expect(updateBuilder.where).toHaveBeenCalledWith(eq(prescriptions.prescriptionId, 1));
      expect(updateBuilder.returning).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a prescription', async () => {
      const deleteBuilder = {
        where: jest.fn().mockReturnThis(),
      };
      (db.delete as jest.Mock).mockReturnValue(deleteBuilder);

      await PrescriptionService.delete(1);

      expect(db.delete).toHaveBeenCalledWith(prescriptions);
      expect(deleteBuilder.where).toHaveBeenCalledWith(eq(prescriptions.prescriptionId, 1));
    });
  });
});
