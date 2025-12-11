import { pool } from "../../config/db";

const createBooking = async (
  payload: Record<string, unknown>,
  user: { id: number; role: string }
) => {
  const { vehicle_id, rent_start_date, rent_end_date, customer_id } = payload;

  const start = new Date(rent_start_date as string);
  const end = new Date(rent_end_date as string);

  const diffMs = end.getTime() - start.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || days <= 0) {
    throw new Error("rent_end_date must be after rent_start_date");
  }

  const finalCustomerId =
    user.role === "admin" && customer_id ? Number(customer_id) : user.id;

  const vehicleRes = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1`,
    [vehicle_id]
  );

  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  const totalPrice = Number(vehicle.daily_rent_price) * days;

  const bookingRes = await pool.query(
    `INSERT INTO bookings(
       customer_id,
       vehicle_id,
       rent_start_date,
       rent_end_date,
       total_price,
       status
     ) VALUES($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [finalCustomerId, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  await pool.query(
    `UPDATE vehicles
     SET availability_status='booked'
     WHERE id=$1`,
    [vehicle_id]
  );

  return bookingRes;
};

const getBookings = async (user: { id: number; role: string }) => {
  if (user.role === "admin") {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result;
  } else {
    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1`,
      [user.id]
    );
    return result;
  }
};

const cancelBooking = async (
  bookingId: string,
  user: { id: number; role: string }
) => {
  const bookingRes = await pool.query(
    `SELECT * FROM bookings WHERE id=$1`,
    [bookingId]
  );

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (user.role !== "admin" && booking.customer_id !== user.id) {
    throw new Error("Forbidden");
  }

  const today = new Date().toISOString().slice(0, 10);
  if (booking.rent_start_date <= today) {
    throw new Error("Cannot cancel booking on or after start date");
  }

  if (booking.status !== "active") {
    throw new Error("Only active bookings can be cancelled");
  }

  const result = await pool.query(
    `UPDATE bookings
     SET status='cancelled', updated_at=NOW()
     WHERE id=$1
     RETURNING *`,
    [bookingId]
  );

  await pool.query(
    `UPDATE vehicles
     SET availability_status='available'
     WHERE id=$1`,
    [booking.vehicle_id]
  );

  return result;
};

const markReturned = async (bookingId: string) => {
  const bookingRes = await pool.query(
    `SELECT * FROM bookings WHERE id=$1`,
    [bookingId]
  );

  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (booking.status !== "active") {
    throw new Error("Only active bookings can be returned");
  }

  const result = await pool.query(
    `UPDATE bookings
     SET status='returned', updated_at=NOW()
     WHERE id=$1
     RETURNING *`,
    [bookingId]
  );

  await pool.query(
    `UPDATE vehicles
     SET availability_status='available'
     WHERE id=$1`,
    [booking.vehicle_id]
  );

  return result;
};

export const bookingServices = {
  createBooking,
  getBookings,
  cancelBooking,
  markReturned,
};
