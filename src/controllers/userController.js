// src/controllers/userController.js
import cloudinary from '../config/cloudinary.js';
import {
  findUserById,
  findUserByEmail,
  findAllUsers,
  updateUser,
  deleteUserById,
} from '../models/authModel.js';
import upload from '../config/multer.js';


/**
 * GET user profile
 */
export async function getUserProfile(req, res) {
  console.log('--- Controller: "getUserProfile" reached successfully! ---');
  try {
    const userId = req.user.id;

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User profile retrieved successfully',
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
}


/**
 * GET all users
 */
export async function getAllUsers(req, res) {
  try {
    const users = await findAllUsers();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

/**
 * GET single user by ID
 */
export async function getUserById(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user' });
  }
}

/**
 * PUT update user (with optional profilePicture)
 */
export const httpUpdateUser = [
    upload.single('profilePicture'),
  async (req, res, next) => {
    try {
      const user = await findUserById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      req._userToUpdate = user;
      next();
    } catch (err) {
      res.status(500).json({ error: 'Error validating user' });
    }
  },

  async (req, res) => {
    const { id } = req.params;
    const { fullName, email } = req.body;

    try {
      const updateData = {};
      if (fullName) updateData.fullName = fullName;

      if (email) {
        if (!email.includes('@')) {
          return res.status(400).json({ error: 'Invalid email format' });
        }
        const existing = await findUserByEmail(email);
        if (existing && existing.id !== id) {
          return res.status(409).json({ error: 'Email is already in use' });
        }
        updateData.email = email;
      }

      if (req.file) {
        const profilePicture = req.file.buffer.toString('base64');
        const uploadedImage = await cloudinary.uploader.upload(
          `data:image/jpeg;base64,${profilePicture}`,
          { upload_preset: 'tfb_users' }
        );
        updateData.profilePicture = uploadedImage.secure_url;
      }

      const updatedUser = await updateUser(id, updateData);
      res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Update failed' });
    }
  },
];

/**
 * DELETE user
 */
export async function deleteUser(req, res) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await deleteUserById(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
}
