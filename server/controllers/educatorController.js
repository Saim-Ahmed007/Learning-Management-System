import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'

//update role to educator
export const updateRoleToEducator = async(req,res) => {
    try {
        const userId = req.auth.userId
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
        res.json({success: true, message: 'you can publish a course now'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
} 

//add new course
export const addCourse = async(req,res) => {
    try {
        const {courseData} = req.body
        const imgFile = req.file
        const educatorId = req.auth.userId
        if(!imgFile){
            return res.json({success: false, message: 'Thumbnail not attached'})
        }
        const parseCoursedData = await JSON.parse(courseData)
        parseCoursedData.educator = educatorId
        const newCourse = await Course.create(parseCoursedData)
        const imgUpload = await cloudinary.uploader.upload(imgFile.path)
        newCourse.courseThumbnail = imgUpload.secure_url
        await newCourse.save()
        res.json({success: true, message: 'Course Added'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getEducatorCourses = async(req,res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator})
        res.json({success: true, courses})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get educator dashboard data (earning, no of students, no of courses)
export const educatorDashboardData = async(req,res) => {
    try {
        const educator = req.auth.userId
        const courses = await Course.find({educator})
        const totalCourses = courses.length
        const courseIds = courses.map(course => course._id)

        //calculate total earnings
        const purchases = await Purchase.find({
            courseId : {$in: courseIds},
            status: 'completed'
        })
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        //collect unique enrolled student Ids with their course title
        const enrolledStudentsData = []
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl')
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.json({success: true, dashbardData: {
            enrolledStudentsData, totalEarnings, totalCourses
        }})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get enrolled students data with purchase data
export const getEnrolledStudentsData = async(req,res) => {
    try {
        const educator = req.auth.userId
        const {courses} = await Course.find({educator})
        const courseIds = courses.map(course => course._id)
        const purchases = await Purchase.find({
            courseId : {$in: courseIds},
            status: 'completed'
        }).populate('userId','name imageUrl').populate('courseId', 'courseTitle')
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))
        res.json({success: true, enrolledStudents})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

