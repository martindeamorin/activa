var express = require('express');
var router = express.Router();
const landingController = require("../../controllers/landing/landingController")
const paymentController = require("../../controllers/system/paymentController")


router.get("/", landingController.viewIndex)
router.get("/curso/:courseName", landingController.viewCourse)
router.post("/mp-checkout", userMiddleware.isLogged, paymentController.mpCheckout)
router.post("/mp-notification", paymentController.mpNotification)
router.post("/pp-notification", paymentController.ppNotification)

module.exports = router;
