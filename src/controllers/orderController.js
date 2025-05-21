import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  updateTracking,
  getOrderStats,
} from '../models/orderModel.js';
import { getDesignById } from '../models/designModel.js';
import { getFabricById } from '../models/fabricModel.js';

export async function httpCreateOrder(req, res) {
  try {
    const { designId, fabricId, size, quantity, notes, total } = req.body;
    const userId = req.user.id;

    if (!designId || !fabricId || !size || !quantity || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const design = await getDesignById(designId);
    if (!design || design.status !== 'RENDERED') {
      return res.status(400).json({ error: 'Design not ready for ordering' });
    }

    const fabric = await getFabricById(fabricId);
    if (!fabric) return res.status(404).json({ error: 'Fabric not found' });

    const order = await createOrder({
      userId,
      designId,
      fabricId,
      size,
      quantity: parseInt(quantity),
      notes,
      total: parseFloat(total),
    });

    res.status(201).json({ message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
}

export async function httpGetMyOrders(req, res) {
  try {
    const orders = await getUserOrders(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your orders' });
  }
}

export async function httpGetOrderById(req, res) {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving order' });
  }
}

export async function httpGetAllOrders(req, res) {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving all orders' });
  }
}

export async function httpUpdateOrderStatus(req, res) {
  try {
    const updated = await updateOrderStatus(req.params.id, req.body.status);
    res.json({ message: 'Order status updated', order: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
}

export async function httpDeleteOrder(req, res) {
  try {
    await deleteOrder(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
}



/* PATCH /:id/tracking */
export async function httpUpdateTracking(req, res) {
  try {
    const { shippingDate, trackingNumber, deliveryDate } = req.body;
    const updated = await updateTracking(req.params.id, {
      shippingDate,
      trackingNumber,
      deliveryDate,
    });
    res.json({ message: 'Tracking info updated', order: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update tracking' });
  }
}

/* GET /stats */
export async function httpGetOrderStats(req, res) {
  try {
    const stats = await getOrderStats();         // [{ status:'PENDING', _count:{_all:7}}, ...]
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Cannot compute stats' });
  }
}