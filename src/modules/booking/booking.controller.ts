import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await bookingServices.createBooking(req.body, {
      id: currentUser.id,
      role: currentUser.role,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await bookingServices.getBookings({
      id: currentUser.id,
      role: currentUser.role,
    });

    const msg =
      currentUser.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    res.status(200).json({
      success: true,
      message: msg,
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// status: "cancelled" (customer) or "returned" (admin)
const updateBooking = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { status } = req.body;
    const bookingId = req.params.bookingId;

    if (status === "cancelled") {
      const result = await bookingServices.cancelBooking(bookingId!, {
        id: currentUser.id,
        role: currentUser.role,
      });

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result.rows[0],
      });
    }

    if (status === "returned") {
      if (currentUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Admin only",
        });
      }

      const result = await bookingServices.markReturned(bookingId!);

      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: result.rows[0],
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid status. Use "cancelled" or "returned".',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
};
