import prisma from '../config/database.js';

export async function createFabric(data) {
  return await prisma.fabric.create({ data });
}

export async function getAllFabrics() {
  return await prisma.fabric.findMany({
    where: {
            // We might only want to show platform fabrics, not other users' uploads
        source: 'PLATFORM',
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getFabricById(id) {
  return await prisma.fabric.findUnique({ where: { id } });
}

export async function updateFabric(id, data) {
  return await prisma.fabric.update({
    where: { id },
    data,
  });
}

export async function deleteFabric(id) {
  return await prisma.fabric.delete({ where: { id } });
}
