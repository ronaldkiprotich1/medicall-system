import { Request, Response } from 'express';
import { ComplaintService } from '../complaints/complaints.service';

export class ComplaintController {
  static async getAll(_req: Request, res: Response) {
    try {
      const complaints = await ComplaintService.getAll();
      res.json({ complaints }); // Wrap in complaints array
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch complaints' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID format' });
    
    try {
      const complaint = await ComplaintService.getById(id);
      if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
      res.json(complaint); // Return complaint directly to match current API response
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch complaint' });
    }
  }

  // NEW: Get complaints by user ID
  static async getByUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID format' });
    
    try {
      const complaints = await ComplaintService.getByUserId(userId);
      res.json({ complaints });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch complaints by user ID' });
    }
  }

  // NEW: Get complaints by appointment ID
  static async getByAppointmentId(req: Request, res: Response) {
    const appointmentId = parseInt(req.params.appointmentId);
    if (isNaN(appointmentId)) return res.status(400).json({ error: 'Invalid appointment ID format' });
    
    try {
      const complaints = await ComplaintService.getByAppointmentId(appointmentId);
      res.json({ complaints });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch complaints by appointment ID' });
    }
  }

  static async create(req: Request, res: Response) {
    const { userId, subject, description } = req.body;
    if (!userId || !subject || !description) {
      return res.status(400).json({ error: 'userId, subject, and description are required' });
    }
    if (typeof userId !== 'number') {
      return res.status(400).json({ error: 'userId must be a number' });
    }
    try {
      const [complaint] = await ComplaintService.create(req.body);
      res.status(201).json(complaint);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create complaint' });
    }
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID format' });
    
    try {
      const exists = await ComplaintService.getById(id);
      if (!exists) return res.status(404).json({ error: 'Complaint not found' });
      
      const [complaint] = await ComplaintService.update(id, req.body);
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update complaint' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID format' });
    
    try {
      const exists = await ComplaintService.getById(id);
      if (!exists) return res.status(404).json({ error: 'Complaint not found' });
      
      await ComplaintService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete complaint' });
    }
  }

  // Update complaint status (PATCH)
  static async updateStatus(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid complaint ID format' });
    if (!status) return res.status(400).json({ error: 'Status is required' });
    
    try {
      const exists = await ComplaintService.getById(id);
      if (!exists) return res.status(404).json({ error: 'Complaint not found' });
      
      const [updated] = await ComplaintService.update(id, { status });
      res.json({ message: 'Status updated successfully', updated });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  }
}