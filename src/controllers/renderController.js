// src/controllers/renderController.js
import cloudinary from '../config/cloudinary.js';
import {
  getPendingDesigns,
  updateDesign,
} from '../models/designModel.js';

export async function httpGetPendingDesigns(req, res) {
  try {
    const designs = await getPendingDesigns();
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load pending designs' });
  }
}

export async function httpUploadRender(req, res) {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ error: 'File required' });

    const buffer = req.file.buffer.toString('base64');
    const upload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer}`);
    const design = await updateDesign(id, {
      renderedImageUrl: upload.secure_url,
      status: 'RENDERED',
    });

    res.status(200).json({ message: '3D render uploaded', design });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
}

export async function httpRejectDesign(req, res) {
  try {
    const { id } = req.params;
    const design = await updateDesign(id, { status: 'REJECTED' });
    res.json({ message: 'Design rejected', design });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed' });
  }
}
