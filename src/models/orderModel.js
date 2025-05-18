import prisma from '../config/database.js';

export function createOrder(data) {
  return prisma.order.create({ data });
}

export function getOrderById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: { design: true, fabric: true, user: true },
  });
}

export function getUserOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: { design: true, fabric: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function getAllOrders() {
  return prisma.order.findMany({
    include: { design: true, fabric: true, user: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function updateOrderStatus(id, status) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

export function updateTracking(id, tracking) {
  // tracking = { shippingDate?, trackingNumber?, deliveryDate? }
  return prisma.order.update({
    where: { id },
    data: tracking,
  });
}

export function deleteOrder(id) {
  return prisma.order.delete({ where: { id } });
}

/* -------- analytics -------- */
export function getOrderStats() {
  return prisma.order.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
}
