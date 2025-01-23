import { createOrderAction, createRazorpayOrder } from "@/utils/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin");

  try {
    // Create the order
    const orderDetails = await createOrderAction();

    if (!orderDetails) {
      return NextResponse.json(
        { success: false, message: "Order creation failed" },
        { status: 500 }
      );
    }
    const { orderTotal, orderId, cartId } = orderDetails;

    const razorpayOrder = await createRazorpayOrder(
      orderTotal,
      origin as string
    );

    return NextResponse.json({
      success: true,
      razorpayOrder,
      orderId,
      cartId,
    });
  } catch (error) {
    console.error("Error in placing order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order", error },
      { status: 500 }
    );
  }
}
