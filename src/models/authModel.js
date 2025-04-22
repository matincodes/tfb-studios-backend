// src/models/authModel.js
import prisma from '../config/database.js';

/**
 * Find user by email (used during signup and login).
 * This function does not include the password field.
 */

export async function findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        createdAt: true,
      },
    });
  }

/**
 * Find user including password field (used during login).
 */
export async function findUserWithPassword(email) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      password: true, // plain hashed string
    },
  });
}

/**
 * Find user by ID, exclude password (used after auth success).
 */
export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Create a new user (used during signup).
 */
export async function createUser(data) {
  const { email, password, fullName, role = 'USER' } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  return prisma.user.create({
    data: {
      email,
      password,
      fullName,
      role,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Find All Users (used in admin panel).
 */

export async function findAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
      },
    });
  }

/**
 * Update user by ID (used in admin panel).
 */
  
export async function updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        profilePicture: true,
        createdAt: true,
      },
    });
  }
  
  export async function deleteUserById(id) {
    return prisma.user.delete({ where: { id } });
  }
  