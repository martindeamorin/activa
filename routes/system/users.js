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
router.get("/cursos/:id/clases", userMiddleware.isLogged, userController.viewClasses)
router.get("/cursos/:courseId/modulos/:moduleId/clases/:classId", userMiddleware.isLogged, userController.viewClass)
router.get("/logout", userMiddleware.isLogged, userController.logout)


module.exports = router;
