import { Request, Response } from 'express';
import { PrescriptionService } from '../prescription/prescription.service';

export class PrescriptionController {
  static async getAll(_req: Request, res: Response) {
    const result = await PrescriptionService.getAll();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const result = await PrescriptionService.getById(id);
    if (!result) return res.status(404).json({ error: 'Prescription not found' });

    res.json(result);
  }

  static async create(req: Request, res: Response) {
    const {
      appointmentId,
      doctorId,
      patientId,
      medications,
      dosage,
      instructions,
      notes,
    } = req.body;

    if (
      !appointmentId || !doctorId || !patientId ||
      !medications || !dosage || !instructions
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof medications !== 'string') {
      return res.status(400).json({ error: 'Medications must be a JSON string' });
    }

    const [prescription] = await PrescriptionService.create(req.body);
    res.status(201).json(prescription);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid prescription ID' });
    }

    const data = req.body;
    if (data.medications && typeof data.medications !== 'string') {
      return res.status(400).json({ error: 'Medications must be a JSON string' });
    }

    const [prescription] = await PrescriptionService.update(id, data);
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json(prescription);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid prescription ID' });
    }

    const deleted = await PrescriptionService.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.status(204).send();
  }
}
