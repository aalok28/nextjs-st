import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const requestHeaders = new Headers(req.headers);
  const origin = requestHeaders.get("origin");
  console.log(origin);
  try {
    // const {
    //   orderId,
    //   cartId,
    //   orderCreationId,
    //   razorpayPaymentId,
    //   razorpaySignature,
    // } = await req.json();

    // const queryParams = new URLSearchParams({
    //   orderId,
    //   cartId,
    //   orderCreationId,
    //   razorpayPaymentId,
    //   razorpaySignature,
    // });

    const verifyData = await req.json();

    // const response = await fetch(
    //   `http://localhost:3000/api/verify?${queryParams}`,
    //   {
    //     method: "GET",
    //   }
    // );

    const response = await fetch("http://localhost:3000/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Payment verification failed");
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in payment-verification API:", error);
    return NextResponse.json(
      { message: "Payment verification failed", isOk: false },
      { status: 500 }
    );
  }
};
