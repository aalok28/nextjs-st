"use client";

import Script from "next/script";

const RazorpayScriptProvider = () => {
  return (
    <Script
      type="text/javascript"
      src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="lazyOnload" // Load script after page has loaded
      onLoad={() => console.log("Razorpay SDK loaded successfully.")}
      onError={() => console.error("Failed to load Razorpay SDK.")}
    />
  );
};

export default RazorpayScriptProvider;
