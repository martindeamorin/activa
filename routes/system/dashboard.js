var express = require('express');
var router = express.Router();
const dashboardController = require("../../controllers/system/dashboardController")
const userMiddleware = require("../../middlewares/system/userMiddleware")
const path = require("path");
const multer = require('multer');
var storage = multer.diskStorage({
	  destination:(req,file,cb)=>{
			cb(null,'public/files');
	  },
	  filename:(req,file,cb)=>{
			cb(null,file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname));
		}
    });
var storageImg = multer.diskStorage({
	destination:(req,file,cb)=>{
		  cb(null,'public/images');
	},
	filename:(req,file,cb)=>{
		cb(null,file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname));
	  }
  });
var upload = multer({storage:storage});
var uploadImg = multer({storage: storageImg})

/* GET home page. */
router.get('/course-create', userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.viewIndex);
router.post('/course-create', uploadImg.any(), userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.courseRegister);
router.get('/course-edit/:id', userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.viewCourseEdit);
router.get("/course-edit/:id/delete", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.courseDelete)
router.post('/course-edit/:id', uploadImg.any(), userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.courseEdit);
router.post('/course-edit/:id/class-create', userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.classCreate);
router.get("/class-edit/:id", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.viewClassEdit)
router.post('/class-edit/:id', userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.classEdit);
router.get("/class-edit/:id/delete", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.classDelete)
router.post('/class-edit/:id/file-upload', upload.any(), userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.fileUpload);
router.get("/class-edit/:id/delete", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.classDelete)
router.get("/class-edit/:id/file-delete", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.fileDelete)
router.post("/course-enable", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.courseEnable)
router.post("/payment-enable", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.paymentEnable)
router.post("/class-enable", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.classEnable)
router.get("/transactions", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.viewTransactions)
router.post("/transactions", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.sortTransactions)
router.get("/transactions/:id", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.viewTransactionDetail)
router.post("/give-access", userMiddleware.isLogged, userMiddleware.isAdmin, dashboardController.giveAccess)

module.exports = router;
