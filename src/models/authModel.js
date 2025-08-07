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
        name: true,
        isVerified: true,
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
      password: {
        select: {
          hashed: true // Select the 'hashed' field
        }
      },
      isVerified: true,
    }
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
      name: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Create a new user (used during signup).
 */
export async function createUser(data) {
  console.log("--Starting Create--", data)
  const { email, hashedPassword, name, role } = data;
  console.log("Creating",email, hashedPassword, name, role)

  const existingUser = await prisma.user.findUnique({ where: { email } });
  console.log("Exist:", existingUser)
  if (existingUser) throw new Error('Email already registered');

  console.log("Create User:", email, name, hashedPassword, role)

  const password = await prisma.password.create({
    data: {
      hashed: hashedPassword,
    },
  });

  return prisma.user.create({
    data: {
      name,
      email,
      role,
      passwordId: password.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
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
        name: true,
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
        name: true,
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
  

  //Find a user by their verification token.
export async function findUserByVerificationToken(token) {
    return prisma.user.findUnique({
        where: { verificationToken: token },
    });
}

// Update a user's verification status.
// This function sets isVerified to true and clears the token so it can't be used again.
export async function activateUserAccount(userId) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            isVerified: true,
            verificationToken: null, // Clear the token
        },
    });
}

export async function updateUserWithToken(userId, verificationToken) {
    return prisma.user.update({
        where: { id: userId },
        data: { verificationToken: verificationToken },
    });
}