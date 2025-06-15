// src/controllers/designController.js
import cloudinary from '../config/cloudinary.js';
import {
  createDesign,
  getUserDesigns,
  getDesignById,
  deleteDesign,
} from '../models/designModel.js';

export async function httpCreateDesign(req, res) {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) return res.status(400).json({ error: 'Name is required' });

    let imageUrl;
    if (req.file) {
      const buffer = req.file.buffer.toString('base64');
      const upload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer}`);
      imageUrl = upload.secure_url;
    }

    const design = await createDesign({
      name,
      description,
      imageUrl,
      createdById: userId,
      status: 'UPLOADED',
    });

    res.status(201).json({ message: 'Design submitted', design });
  } catch (err) {
    res.status(500).json({ error: 'Design creation failed' });
  }
}

export async function httpGetMyDesigns(req, res) {
  try {
    const designs = await getUserDesigns(req.user.id);
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your designs' });
  }
}


export async function httpGetDesignById(req, res) {
  try {
    const design = await getDesignById(req.params.id);
    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    if (req.user.role !== 'ADMIN' && design.createdById !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to view this design.' });
    }

    res.json(design);
  } catch (err) {
    console.error("Error fetching design by ID:", err);
    res.status(500).json({ error: 'Error fetching design' });
  }
}


export async function httpDeleteDesign(req, res) {
  try {
    const designToDelete = await getDesignById(req.params.id);
    if (!designToDelete) {
        return res.status(404).json({ error: 'Design not found' });
    }

    if (req.user.role !== 'ADMIN' && designToDelete.createdById !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this design.' });
    }

    await deleteDesign(req.params.id);
    res.json({ message: 'Design deleted successfully' });
  } catch (err) {
    console.error("Error deleting design:", err);
    res.status(500).json({ error: 'Delete failed' });
  }
}
