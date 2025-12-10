import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleware.js'
import { getEnrolledStudentsData } from './../controllers/educatorController.js';
const educatorRoute = express.Router()

educatorRoute.get('/update-role', updateRoleToEducator)
educatorRoute.post('/add-course', upload.single('image'), protectEducator, addCourse)
educatorRoute.get('/courses', protectEducator, getEducatorCourses)
educatorRoute.get('/dasboard', protectEducator, educatorDashboardData)
educatorRoute.get('/enrolled-students', protectEducator, getEnrolledStudentsData)


export default educatorRoute