import { Router } from 'express'
import UserController from '../controllers/user.controller'
import AdminController from '../controllers/admin.controller'
import LoginController from '../controllers/login.controller'
import TeamController from '../controllers/team.controller';


const router = Router();

//User routes
router.post('/users', UserController.createUser)

//Admin routes
router.post('/admin', AdminController.createAdmin)

//auth
router.post('/login', LoginController.login)

//team
router.post('/teams', TeamController.createTeam)




export default router