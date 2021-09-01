var express = require('express');
var router = express.Router();
const landingController = require("../../controllers/landing/landingController")
const paymentController = require("../../controllers/system/paymentController")


router.get("/", landingController.viewIndex)
router.get("/curso/:id", landingController.viewCourse)
router.post("/mp-checkout", userMiddleware.isLogged, paymentController.mpCheckout)
router.post("/mp-notification", paymentController.mpNotification)

module.exports = router;
