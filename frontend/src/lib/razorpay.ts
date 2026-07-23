import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";

if (!keyId || !keySecret || keySecret === "placeholder") {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[DEV MODE] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured or using placeholder."
    );
  }
}

export const razorpay = new Razorpay({
  key_id: keyId || "placeholder",
  key_secret: keySecret || "placeholder",
});