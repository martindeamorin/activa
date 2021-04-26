var express = require('express');
var router = express.Router();
const userController = require("../../controllers/system/userController")
const userMiddleware = require("../../middlewares/system/userMiddleware")

/* GET users listing. */
router.get('/register', userController.viewRegister);
router.post('/register', userMiddleware.registerValidation, userController.register);
router.get('/login', userController.viewLogin);
router.post('/login', userMiddleware.loginValidation, userController.login);
router.get("/cursos", userMiddleware.isLogged, userController.viewCourses)
router.get("/cursos/:courseId/clases", userMiddleware.isLogged, userMiddleware.payedCourse,userController.viewClasses)
router.get("/cursos/:courseId/clases/:classId", userMiddleware.isLogged,userMiddleware.payedCourse, userController.viewClass)
router.get("/logout", userMiddleware.isLogged, userController.logout)
router.get("/recuperar-contrasena", userController.viewPasswordRecovery)
router.post("/recoveryEmail", userController.sendRecoveryEmail)
router.get("/recuperar-contrasena/pin", userController.viewRecoveryPin)
router.post("/recuperar-contrasena/pin", userController.recoveryPin)
router.get("/recuperar-contrasena/modificar", userController.viewChangePassword)
router.post("/recuperar-contrasena/modificar", userMiddleware.recoverValidation ,userController.changePassword)

module.exports = router;
