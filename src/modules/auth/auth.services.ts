import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone } = payload;

  const lowerEmail = (email as string).toLowerCase();
  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role)
     VALUES($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, role`,
    [name, lowerEmail, hashedPass, phone, "customer"]
  );

  return result;
};

const loginUser = async (email: string, password: string) => {
  const lowerEmail = email.toLowerCase();
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    lowerEmail,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  return { token, user };
};

export const authServices = {
  signupUser,
  loginUser,
};
