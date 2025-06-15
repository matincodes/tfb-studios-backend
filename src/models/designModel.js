import prisma from '../config/database.js';

export async function createDesign(data) {
  return prisma.design.create({ data });
}

export async function getUserDesigns(userId) {
  return prisma.design.findMany({
    where: { createdById: userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDesignById(id) {
  return prisma.design.findUnique({ where: { id } });
}
  

export async function updateDesign(id, data) {
  return prisma.design.update({
    where: { id },
    data,
  });
}

export async function deleteDesign(id) {
  return prisma.design.delete({
    where: { id },
  });
}

export async function getDesignsAwaitingRender() {
    return prisma.design.findMany({
        where: { status: 'UPLOADED' },
        orderBy: { createdAt: 'asc' },
        include: { createdBy: { select: { name: true, email: true }}}
    });
}

