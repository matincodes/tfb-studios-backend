// src/controllers/commentController.js
import {
  createComment,
  getCommentsByDesignId,
  getCommentsByRenderedDesignId
} from '../models/commentModel.js';

export async function httpAddComment(req, res) {
  const { text } = req.body;
  const userId = req.user.id;
  const { designId, renderedDesignId } = req.body;

  if (!text) return res.status(400).json({ error: 'Comment text is required' });
  if (!designId && !renderedDesignId) {
    return res.status(400).json({ error: 'Either designId or renderedDesignId must be provided' });
  }

  try {
    const comment = await createComment({
      text,
      authorId: userId,
      designId,
      renderedDesignId,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: 'Could not create comment' });
  }
}

export async function httpGetCommentsForDesign(req, res) {
  const { id } = req.params;
  try {
    const comments = await getCommentsByDesignId(id);
    res.json(comments);
  } catch (err) {
    console.error("Error getting design comments:", err);
    res.status(500).json({ error: 'Could not fetch comments' });
  }
}

export async function httpGetCommentsForRenderedDesign(req, res) {
  const { id } = req.params;
  try {
    const comments = await getCommentsByRenderedDesignId(id);
    res.json(comments);
  } catch (err) {
    console.error("Error getting render comments:", err);
    res.status(500).json({ error: 'Could not fetch comments' });
  }
}
