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
    const { name, description, initialFabricId } = req.body;
    const userId = req.user.id;

    if (!name || !initialFabricId) return res.status(400).json({ error: 'Design name and a selected material are required' });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one design image is required' });
    }

 
    const imageMetadata = [];
    for (const file of req.files) {
      const buffer = file.buffer.toString('base64');
      const upload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer}`, {
        upload_preset: 'design_images',
      });
      imageMetadata.push({
        name: upload.original_filename || file.originalname || "untitled",
        url: upload.secure_url,
        size: (upload.bytes / 1024 / 1024).toFixed(2),
        type: upload.format,
      });
    }

    const design = await createDesign({
      name,
      description,
      imageMetadata: {
        create: imageMetadata,
      },
      createdById: userId,
      initialFabricId,
      status: 'UPLOADED',
    });

    res.status(201).json({ message: 'Design submitted', design });
  } catch (err) {
    console.error("Error creating design:", err);
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
