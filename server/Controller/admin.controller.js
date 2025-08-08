import bcrypt from 'bcryptjs';
import { Admin } from '../Model/admin.model.js';  // adjust path as needed

/**
 * POST /api/admins
 * Creates a new admin.
 * Expects JSON body: { name, password, rollNo }
 */
export async function createAdmin(req, res) {
  try {
    const { name, password, rollNo } = req.body;
    // basic validation
    if (!name || !password || !rollNo) {
      return res.status(400).json({ message: 'name, password and rollNo are all required.' });
    }

    // check duplicates
    const exists = await Admin.findOne({
      $or: [{ name }, { rollNo }]
    });
    if (exists) {
      return res
        .status(409)
        .json({ message: 'An admin with that name or roll number already exists.' });
    }

    // hash password
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    // create & save
    const admin = new Admin({ name, password: hash, rollNo });
    await admin.save();

    return res
      .status(201)
      .json({
        message: 'Admin created successfully.',
        admin: { id: admin._id, name: admin.name, rollNo: admin.rollNo }
      });
  } catch (err) {
    console.error('📋 createAdmin error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
}
