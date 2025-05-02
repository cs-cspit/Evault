const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const otpRoutes = require("./routes/Otp");
const kyc = require("./routes/kyc")
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/otp", otpRoutes);
app.use("/kyc/generateOTP",kyc);
app.use("/kyc/verifyOTP",kyc);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
