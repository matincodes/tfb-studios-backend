import {
    createFabric,
    getAllFabrics,
    getFabricById,
    updateFabric,
    deleteFabric,
  } from '../models/fabricModel.js';
  import cloudinary from '../config/cloudinary.js';
  
  export async function httpCreateFabric(req, res) {
    try {
      const { name, type, color } = req.body;
  
      if (!name || !type || !color) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      let imageUrl;
      if (req.file) {
        const buffer = req.file.buffer.toString('base64');
        const upload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer}`);
        imageUrl = upload.secure_url;
      }
  
      const fabric = await createFabric({ name, type, color, imageUrl });
      res.status(201).json({ message: 'Fabric created', fabric });
    } catch (err) {
      res.status(500).json({ error: 'Fabric creation failed' });
    }
  }
  
  export async function httpGetAllFabrics(req, res) {
    try {
      const fabrics = await getAllFabrics();
      res.json(fabrics);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch fabrics' });
    }
  }
  
  export async function httpGetFabricById(req, res) {
    try {
      const fabric = await getFabricById(req.params.id);
      if (!fabric) return res.status(404).json({ error: 'Fabric not found' });
      res.json(fabric);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching fabric' });
    }
  }
  
  export async function httpUpdateFabric(req, res) {
    try {
      const { name, type, color } = req.body;
  
      let imageUrl;
      if (req.file) {
        const buffer = req.file.buffer.toString('base64');
        const upload = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer}`);
        imageUrl = upload.secure_url;
      }
  
      const updated = await updateFabric(req.params.id, {
        name,
        type,
        color,
        ...(imageUrl && { imageUrl }),
      });
  
      res.json({ message: 'Fabric updated', fabric: updated });
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  }
  
  export async function httpDeleteFabric(req, res) {
    try {
      await deleteFabric(req.params.id);
      res.json({ message: 'Fabric deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Deletion failed' });
    }
  }
  