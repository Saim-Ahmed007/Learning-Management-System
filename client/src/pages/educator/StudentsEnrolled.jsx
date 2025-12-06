import React, { useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {
    const [enrolledStudents, setEnrolledStudents] = useState(null)
    const fetchEnrolledStudents = async () => {
        setEnrolledStudents(dummyStudentEnrolled)
    }
    useEffect(() => {
        fetchEnrolledStudents()
    },[])
    return enrolledStudents ? (
        <div className='min-h-screen flex flex-col items-start gap-4 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
           <h2 className="pb-4 lext-lg font-medium">My Courses</h2> 
           <div className="flex flex-col items-start max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
           <table className='md:table-auto table-fixed w-full overflow-hidden'>
             <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
                    <tr>
                        <th className='px-4 py-3 font-semibold truncate'>#</th>
                        <th className='px-4 py-3 font-semibold truncate'>Student Name</th>
                        <th className='px-4 py-3 font-semibold truncate'>Course Title</th>
                        <th className='px-4 py-3 font-semibold truncate'>Date</th>
                    </tr>
                </thead>
                <tbody className='text-gray-700 text-sm'>
                    {
                        enrolledStudents.map((item, index) => (
                            <tr key={index} className='border-b border-gray-500/20'>
                                <td className='px-4 py-3 hidden sm:table-cell'>
                                    {index + 1}
                                </td>
                                <td className="md:px-4 px-2 py-3 flex items-center space-x-3 ">
                                    <img src={item.student.imageUrl} alt="" className="h-9 w-9 rounded-full"/>
                                    <span className="truncate">{item.student.name}</span>
                                </td>
                                <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                                <td className='px-4 py-3 truncate'>{new Date(item.purchaseDate).toLocaleDateString()}</td>
                            </tr>
                        ))
                    }

                </tbody>
           </table>

           </div>
        </div>
    ) : <Loading/>
};

export default StudentsEnrolled;