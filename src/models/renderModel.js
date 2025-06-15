// src/models/renderModel.js
import prisma from '../config/database.js';

// Admin uploads a new render for a sketch
export async function createRenderedDesign({ designId, fabricId, imageUrl, notes, adminUserId }) {
    return prisma.$transaction(async (tx) => {
        // 1. Create the RenderedDesign record
        const newRenderedDesign = await tx.renderedDesign.create({
            data: {
                designId,
                fabricId,
                imageUrl,
                notes,
                createdById: adminUserId,
                status: 'PENDING_REVIEW',
            },
        });

        // 2. Update the parent Design's status
        await tx.design.update({
            where: { id: designId },
            data: { status: 'REVIEW_PENDING' },
        });

        return newRenderedDesign;
    });
}

// User gets all renders for a sketch they own
export async function getRendersForSketch(designId, userId) {
    const design = await prisma.design.findUnique({ where: { id: designId } });

    // Security check: Make sure the design exists and the user requesting owns it.
    if (!design) throw new Error('Parent design not found');
    if (design.createdById !== userId) throw new Error('User not authorized to view these renders');

    return prisma.renderedDesign.findMany({
        where: { designId: designId },
        include: {
            fabric: true,
            createdBy: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}

// User accepts a render
export async function acceptRender(renderedDesignId, userId) {
    return prisma.$transaction(async (tx) => {
        const renderedDesign = await tx.renderedDesign.findUnique({
            where: { id: renderedDesignId },
            include: { design: true },
        });

        if (!renderedDesign) throw new Error('Rendered design not found');
        if (renderedDesign.design.createdById !== userId) throw new Error('User not authorized to accept this render');
        if (renderedDesign.design.status !== 'PENDING_REVIEW') throw new Error('This render is not pending review.');

        const acceptedRender = await tx.renderedDesign.update({
            where: { id: renderedDesignId },
            data: { status: 'ACCEPTED' },
        });

        await tx.design.update({
            where: { id: renderedDesign.designId },
            data: {
                activeRenderedDesignId: renderedDesignId,
                status: 'REVIEW_COMPLETED',
            },
        });

        await tx.renderedDesign.updateMany({
            where: {
                designId: renderedDesign.designId,
                id: { not: renderedDesignId },
                status: 'PENDING_REVIEW',
            },
            data: { status: 'REJECTED' },
        });

        return acceptedRender;
    });
}

// User rejects a render
export async function rejectRender(renderedDesignId, userId) {
    return prisma.$transaction(async (tx) => {
        const renderedDesign = await tx.renderedDesign.findUnique({
            where: { id: renderedDesignId },
            include: { design: true },
        });

        if (!renderedDesign) throw new Error('Rendered design not found');
        if (renderedDesign.design.createdById !== userId) throw new Error('User not authorized to reject this render');
        if (renderedDesign.status !== 'PENDING_REVIEW') throw new Error('This render is not pending review.');

        const rejectedRender = await tx.renderedDesign.update({
            where: { id: renderedDesignId },
            data: { status: 'REJECTED' },
        });

        // Check if this was the last pending render
        const pendingCount = await tx.renderedDesign.count({
            where: { designId: renderedDesign.designId, status: 'PENDING_REVIEW' },
        });

        if (pendingCount === 0) {
            await tx.design.update({
                where: { id: renderedDesign.designId },
                data: { status: 'REVIEW_COMPLETED' },
            });
        }

        return rejectedRender;
    });
}

// Admin deletes a specific render
export async function deleteRenderById(renderedDesignId) {
    const render = await prisma.renderedDesign.findUnique({ where: { id: renderedDesignId } });
    if (!render) throw new Error('Rendered design not found.');
    await prisma.renderedDesign.delete({ where: { id: renderedDesignId } });
    return render; // Return for imageUrl cleanup
}