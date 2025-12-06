import { useEffect, useState } from "react"
import { dummyCourses } from "../assets/assets"
import { AppContext } from "./context"
import { useNavigate } from "react-router-dom"
import humanizeDuration from 'humanize-duration'

export const AppContextProvider = ({children}) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const [allCourses] = useState(dummyCourses)
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])

    const calculateCourseRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0
        }
        let totalRating = 0
        course.courseRatings.forEach((item)=> {
            totalRating += item.rating
        })
        return totalRating / course.courseRatings.length
    }

    //caclulate course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']})
    }

    //calculate course duration
    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map((chapter) => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration))
            return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']})
    }

    //calculate no of lectures in the course 
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        })
        return totalLectures
    }

    //Fetch user enrolled courses
    const fetchUserEnrolledCourses = async() => {
        setEnrolledCourses(dummyCourses)
    }
    useEffect(()=>{
        fetchUserEnrolledCourses()
    },[])
    
    const value = {
        currency, allCourses, navigate, calculateCourseRating, isEducator, setIsEducator,
        calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses,
        setEnrolledCourses, fetchUserEnrolledCourses
    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}