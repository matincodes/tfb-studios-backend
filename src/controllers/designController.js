// src/controllers/designController.js
import cloudinary from '../config/cloudinary.js';
import {
  createDesign,
  getUserDesigns,
  getRenderedDesigns,
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
      status: 'PENDING_RENDER',
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

export async function httpGetAvailableDesigns(req, res) {
  try {
    const designs = await getRenderedDesigns();
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rendered designs' });
  }
}

export async function httpGetDesignById(req, res) {
  try {
    const design = await getDesignById(req.params.id);
    if (!design) return res.status(404).json({ error: 'Design not found' });
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching design' });
  }
}

export async function httpDeleteDesign(req, res) {
  try {
    await deleteDesign(req.params.id);
    res.json({ message: 'Design deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
}
