import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const lowerEmail = (email as string).toLowerCase();
  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role)
     VALUES($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, lowerEmail, hashedPass, phone, role || "customer"]
  );

  return result;
};

const getUser = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id=$1`,
    [id]
  );
  return result;
};

const updateUser = async (
  name: string,
  email: string,
  phone: string,
  role: string | undefined,
  id: string
) => {
  const lowerEmail = email.toLowerCase();

  const result = await pool.query(
    `UPDATE users
     SET name=$1,
         email=$2,
         phone=$3,
         role=COALESCE($4, role),
         updated_at=NOW()
     WHERE id=$5
     RETURNING id, name, email, phone, role`,
    [name, lowerEmail, phone, role, id]
  );

  return result;
};

const deleteUser = async (id: string) => {
  const activeBookings = await pool.query(
    `SELECT 1 FROM bookings WHERE customer_id=$1 AND status='active' LIMIT 1`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id=$1 RETURNING id`,
    [id]
  );

  return result;
};

export const userServices = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
