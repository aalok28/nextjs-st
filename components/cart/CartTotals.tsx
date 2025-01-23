"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format";
import { PlaceOrderButton, SubmitButton } from "../form/Buttons";
import { Cart } from "@prisma/client";

const CartTotals = ({ cart }: { cart: Cart }) => {
  const { cartTotal, shipping, tax, orderTotal, id } = cart;

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to place order");
      }

      const { razorpayOrder, orderId, cartId } = result;

      document.body.style.backgroundColor = "#FFFFFF";

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: "NextJs Store",
        description: "Thank you for your purchase!",
        handler: async (response: any) => {
          const verify_data = {
            orderId,
            cartId,
            orderCreationId: razorpayOrder.id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(verify_data),
          });

          const verificationResponse = await result.json();

          if (verificationResponse.redirectUrl) {
            window.location.href = verificationResponse.redirectUrl;
          }
        },
        prefill: {
          name: "Aalok Shah",
          email: "aalokshahwork@gmail.com",
          contact: "9999766587",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in handlePlaceOrder:", error);
    }
  };

  return (
    <div>
      <Card className="p-8">
        <CartTotalRow label="Subtotal" amount={cartTotal} />
        <CartTotalRow label="Shipping" amount={shipping} />
        <CartTotalRow label="Tax" amount={tax} />
        <CardTitle className="mt-8">
          <CartTotalRow label="Order Total" amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      <PlaceOrderButton
        action={handlePlaceOrder}
        text="Place Order"
        className="w-full mt-8"
      />
    </div>
  );
};

function CartTotalRow({
  label,
  amount,
  lastRow,
}: {
  label: string;
  amount: number;
  lastRow?: boolean;
}) {
  return (
    <>
      <p className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </p>
      {lastRow ? null : <Separator className="my-2" />}
    </>
  );
}

export default CartTotals;
