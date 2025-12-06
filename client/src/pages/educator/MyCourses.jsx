import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/context';
import Loading from '../../components/student/Loading';

const MyCourses = () => {
    const {currency, allCourses} = useContext(AppContext)
    const [courses, setCourses] = useState(null)
    const fetchEducatorCourses = async () => {
        setCourses(allCourses)
    }
    useEffect(()=>{
        fetchEducatorCourses()
    },[])

    return courses ? (
        <div className='min-h-screen flex flex-col items-start gap-4 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <h2 className="pb-4 lext-lg font-medium">My Courses</h2>
            <div className="flex flex-col items-start max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className='md:table-auto table-fixed w-full overflow-hidden'>
                <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left '>
                    <tr>
                        <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                        <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                        <th className='px-4 py-3 font-semibold truncate'>Students</th>
                        <th className='px-4 py-3 font-semibold truncate'>Published On</th>
                       
                    </tr>
                </thead>
                <tbody className='text-gray-700 text-sm'>
                    {
                         courses.map((course) => (
                            <tr key={course._id} className='border-b border-gray-500/20'>
                                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate'>
                                    <img className='w-16' src={course.courseThumbnail} alt="course image" />
                                    <span className='truncate hidden md:block'>{course.courseTitle}</span>
                                </td>
                                <td className="px-4 py-3 ">
                                   {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - course.discount * course.coursePrice / 100))} 
                                </td>
                                <td className="px-4 py-3 truncate">
                                   {course.enrolledStudents.length} 
                                </td>
                                <td className="px-4 py-3 truncate">
                                   {new Date(course.createdAt).toLocaleDateString()}
                                </td>
                            
                            </tr>
                        ))
                    }
                </tbody>

            </table>

            </div>
        </div>
    ): <Loading/>
};

export default MyCourses;