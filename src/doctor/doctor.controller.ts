import { Request, Response } from 'express';
import { DoctorService } from '../doctor/doctor.service';

export class DoctorController {
  static async getAll(_req: Request, res: Response) {
    try {
      const result = await DoctorService.getAll();
      res.json(result);
    } catch (error: any) {
      console.error("DoctorController.getAll() Error:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }

    try {
      const result = await DoctorService.getById(id);
      if (!result) return res.status(404).json({ error: 'Doctor not found' });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const [doctor] = await DoctorService.create(req.body);
      res.status(201).json(doctor);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to create doctor", error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }

    try {
      const [doctor] = await DoctorService.update(id, req.body);
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
      res.json(doctor);
    } catch (error: any) {
      res.status(400).json({ message: "Failed to update doctor", error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid doctor ID' });
    }

    try {
      const deleted = await DoctorService.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete doctor", error: error.message });
    }
  }
}
