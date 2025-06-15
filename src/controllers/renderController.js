// // src/controllers/renderController.js
// import cloudinary from '../config/cloudinary.js';
// import {
//   getDesignsAwaitingRender,   
//   adminUploadRenderedDesign,  // 
//   getDesignById,              // Used for validation
//   deleteDesign,                // Used for rejecting a sketch
//   deleteRenderedDesignById
// } from '../models/designModel.js';

// // This function is for admins to get their "to-do" list of sketches.
// export async function httpGetDesignsAwaitingRender(req, res) {
//   try {
//     // Fetches designs with status 'UPLOADED' using our new model function.
//     const designs = await getDesignsAwaitingRender();
//     res.json(designs);
//   } catch (err) {
//     console.error("Error fetching designs awaiting render:", err);
//     res.status(500).json({ error: 'Failed to load designs awaiting render' });
//   }
// }

// // This is for an admin to upload a new rendered design variant for a user to review.
// export async function httpUploadRender(req, res) {
//   try {
//     // It operates on a parent Design (sketch)
//     const { id: designId } = req.params;
//     // It now requires fabricId and optional notes from the request body
//     const { fabricId, notes } = req.body;
//     const adminUserId = req.user.id; // The logged-in admin's ID

//     // --- Validation ---
//     if (!req.file) {
//       return res.status(400).json({ error: 'Render image file is required' });
//     }
//     if (!fabricId) {
//       return res.status(400).json({ error: 'Fabric ID is required for rendering' });
//     }

//     // --- Check if the parent sketch exists ---
//     const parentDesign = await getDesignById(designId);
//     if (!parentDesign) {
//       return res.status(404).json({ error: 'Parent design (sketch) not found' });
//     }
//     // You can only add renders to designs that are newly uploaded or already in review
//     if (parentDesign.status !== 'UPLOADED' && parentDesign.status !== 'REVIEW_PENDING') {
//         return res.status(400).json({ error: `Design is in status ${parentDesign.status} and cannot receive new renders.` });
//     }

//     // --- Cloudinary Upload ---
//     const buffer = req.file.buffer.toString('base64');
//     const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer}`);
//     const imageUrl = uploadResult.secure_url;

//     // --- Call the new transactional model function ---
//     // This creates the RenderedDesign and updates the parent Design's status in one safe operation.
//     const { newRenderedDesign, updatedParentDesign } = await adminUploadRenderedDesign({
//       designId,
//       fabricId,
//       imageUrl,
//       notes,
//       adminUserId,
//     });

//     res.status(201).json({
//       message: 'Render uploaded successfully and is now pending user review.',
//       renderedDesign: newRenderedDesign,
//     });
//   } catch (err) {
//     console.error("Error in httpUploadRender:", err);
//     res.status(500).json({ error: 'Render upload failed: ' + err.message });
//   }
// }

// // This is for an admin to reject an initial sketch *before* any rendering work is done.
// // The action here is to delete the design entirely.
// export async function httpRejectDesign(req, res) {
//   try {
//     const { id } = req.params; // The ID of the parent Design (sketch) to reject.

//     const designToReject = await getDesignById(id);
//     if (!designToReject) {
//       return res.status(404).json({ error: 'Design not found' });
//     }

//     // An admin should only reject/delete a sketch that hasn't been processed yet.
//     if (designToReject.status !== 'UPLOADED') {
//       return res.status(400).json({ error: `Cannot reject a design with status '${designToReject.status}'.` });
//     }

//     // Call the model function to delete the design
//     await deleteDesign(id);

//     // Note: Our schema now cascades deletes, so associated RenderedDesigns would also be deleted if they existed.

//     res.status(200).json({ message: 'Design sketch has been rejected and deleted successfully.' });
//   } catch (err) {
//     console.error("Error rejecting design:", err);
//     res.status(500).json({ error: 'Rejection failed: ' + err.message });
//   }
// }

// // ADDED: Controller for an admin to delete a specific render they uploaded.
// export async function httpDeleteRenderedDesign(req, res) {
//     try {
//         const { renderedDesignId } = req.params;

//         // Call the model function to delete the render from the database
//         const deletedRender = await deleteRenderedDesignById(renderedDesignId);

//         // Delete the image from Cloudinary ---
//         if (deletedRender && deletedRender.imageUrl) {
//             // Extract the public_id from the Cloudinary URL
//             // Example URL: http://res.cloudinary.com/cloud_name/image/upload/v123456789/folder/public_id.jpg
//             const publicId = deletedRender.imageUrl.split('/').pop().split('.')[0];
//             await cloudinary.uploader.destroy(publicId);
//         }

//         res.status(200).json({ message: 'Rendered design and associated image deleted successfully.' });

//     } catch (err) {
//         console.error("Error deleting rendered design:", err);
//         if (err.message.includes('not found')) {
//             return res.status(404).json({ error: err.message });
//         }
//         res.status(500).json({ error: 'Failed to delete rendered design.' });
//     }
// }


// src/controllers/renderController.js
import cloudinary from '../config/cloudinary.js';
// Import from both models as needed
import { getDesignsAwaitingRender, getDesignById as getSketchById, deleteDesign as deleteSketch } from '../models/designModel.js';
import { createRenderedDesign, getRendersForSketch, acceptRender, rejectRender, deleteRenderById } from '../models/renderModel.js';

// --- Admin Actions ---

// Admin gets a list of sketches needing renders.
export async function httpGetDesignsAwaitingRender(req, res) {
  try {
    const designs = await getDesignsAwaitingRender();
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load designs awaiting render' });
  }
}

// Admin uploads a render for a sketch.
export async function httpAdminUploadRender(req, res) {
  try {
    const { designId } = req.params;
    const { fabricId, notes } = req.body;
    if (!req.file || !fabricId) return res.status(400).json({ error: 'Render image and fabricId are required.' });

    const buffer = req.file.buffer.toString('base64');
    const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer}`);

    const newRender = await createRenderedDesign({
      designId,
      fabricId,
      imageUrl: uploadResult.secure_url,
      notes,
      adminUserId: req.user.id,
    });
    res.status(201).json({ message: 'Render uploaded successfully.', render: newRender });
  } catch (err) {
    res.status(500).json({ error: 'Render upload failed: ' + err.message });
  }
}

// Admin rejects/deletes an unsuitable *sketch* before work begins.
export async function httpAdminRejectSketch(req, res) {
  try {
    const { sketchId } = req.params;
    const sketch = await getSketchById(sketchId);
    if (!sketch) return res.status(404).json({ error: 'Sketch not found.' });
    if (sketch.status !== 'UPLOADED') return res.status(400).json({ error: 'Cannot reject a sketch that is already in process.' });
    
    await deleteSketch(sketchId);
    res.status(200).json({ message: 'Sketch has been rejected and deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed: ' + err.message });
  }
}

// Admin deletes a specific *render* they uploaded (e.g., they made a mistake).
export async function httpAdminDeleteRender(req, res) {
    try {
        const { renderedDesignId } = req.params;
        const deletedRender = await deleteRenderById(renderedDesignId);
        if (deletedRender.imageUrl) {
            const publicId = deletedRender.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        res.status(200).json({ message: 'Rendered design deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete rendered design: ' + err.message });
    }
}

// --- User Actions ---

// User gets the list of renders for a sketch they own.
export async function httpGetUserRendersForSketch(req, res) {
  try {
    const { designId } = req.params;
    const renders = await getRendersForSketch(designId, req.user.id);
    res.json(renders);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}

// User accepts a render.
export async function httpUserAcceptRender(req, res) {
  try {
    const { renderedDesignId } = req.params;
    const acceptedRender = await acceptRender(renderedDesignId, req.user.id);
    res.json({ message: 'Render accepted.', acceptedRender });
  } catch (err)
 {
    res.status(400).json({ error: err.message });
  }
}

// User rejects a render.
export async function httpUserRejectRender(req, res) {
  try {
    const { renderedDesignId } = req.params;
    const rejectedRender = await rejectRender(renderedDesignId, req.user.id);
    res.json({ message: 'Render rejected.', rejectedRender });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}