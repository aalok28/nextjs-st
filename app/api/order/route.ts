import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency } = body;

    // Validate input
    if (!amount) {
      return NextResponse.json(
        { error: "Missing required fields: amount" },
        { status: 400 }
      );
    }

    // Create Razorpay order
    var options = {
      amount: amount * 100,
      currency,
      payment_capture: 1, // Auto-capture payment
    };
    const order = await razorpay.orders.create(options);

    // Return the created order
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
