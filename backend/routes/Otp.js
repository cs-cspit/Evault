require("dotenv").config();
const express = require("express");
const twilio = require("twilio");

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = "whatsapp:+14155238886"; // Twilio Sandbox Number

const client = twilio(accountSid, authToken);

// Generate random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Store OTP temporarily (Use DB in production)
const otpStorage = {};

router.post("/send-otp", async (req, res) => {
  const { contactNumber } = req.body;

  if (!contactNumber) {
    return res.status(400).json({ message: "Contact number is required" });
  }

  const otp = generateOTP();
  otpStorage[contactNumber] = otp; // Store OTP

  try {
    await client.messages.create({
      from: twilioNumber,
      to: `whatsapp:${contactNumber}`, // Send OTP via WhatsApp
      body: `Your verification code is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify-otp", (req, res) => {
  const { contactNumber, otp } = req.body;

  if (!contactNumber || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (otpStorage[contactNumber] === otp) {
    delete otpStorage[contactNumber]; // Remove OTP after successful verification
    return res.status(200).json({ message: "OTP verified successfully" });
  }

  res.status(400).json({ message: "Invalid OTP" });
});

module.exports = router;
