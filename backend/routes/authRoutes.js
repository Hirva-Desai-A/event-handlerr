const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

// Public Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOTP);
router.post("/resend-otp", authController.resendOTP); // <-- NEW
router.post("/forgot-password", authController.forgotPassword); // <-- NEW
router.post("/reset-password", authController.resetPassword); // <-- NEW

// Protected Routes
router.get("/me", authMiddleware, authController.getMe);
router.put("/update", authMiddleware, authController.updateUser);
router.post("/send-update-otp", authMiddleware, authController.sendUpdateOtp);

router.get("/test", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route working",
        user: req.user
    });
});

module.exports = router;