// src/models/commentModel.js
import prisma from '../config/database.js';

// Add comment to a design or rendered design
export async function createComment({ text, authorId, designId, renderedDesignId }) {
  return prisma.comment.create({
    data: {
      text,
      authorId,
      designId,
      renderedDesignId,
    },
    include: {
      author: {
        select: {
          name: true,
          role: true,
          profilePicture: true,
        }
      }
    }
  });
}

// Get all comments for a specific design
export async function getCommentsByDesignId(designId) {
  return prisma.comment.findMany({
    where: { designId },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: {
          name: true,
          profilePicture: true,
          role: true
        }
      }
    }
  });
}

// Get all comments for a specific rendered design
export async function getCommentsByRenderedDesignId(renderedDesignId) {
  return prisma.comment.findMany({
    where: { renderedDesignId },
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: {
          name: true,
          profilePicture: true,
          role: true
        }
      }
    }
  });
}
