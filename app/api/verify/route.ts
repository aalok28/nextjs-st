import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/utils/db";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

export const POST = async (request: NextRequest) => {
  const {
    orderId,
    cartId,
    orderCreationId,
    razorpayPaymentId,
    razorpaySignature,
  } = await request.json();

  if (
    !orderId ||
    !cartId ||
    !orderCreationId ||
    !razorpayPaymentId ||
    !razorpaySignature
  ) {
    return NextResponse.json(
      { message: "Missing required parameters." },
      { status: 400 }
    );
  }

  const signature = generatedSignature(orderCreationId, razorpayPaymentId);
  try {
    if (signature === razorpaySignature) {
      //  If the payment is verified, update the order and delete the associated cart
      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
        },
      });

      await db.cart.delete({
        where: {
          id: cartId,
        },
      });

      return new Response(JSON.stringify({ redirectUrl: "/orders" }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("An error occurred while verifying payment : ", error);
    return Response.json(null, {
      status: 500,
      statusText: "An error occurred while verifying payment",
    });
  }
};
