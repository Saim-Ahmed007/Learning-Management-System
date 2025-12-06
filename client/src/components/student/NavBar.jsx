import React, { useContext } from 'react';
import {assets} from '../../assets/assets.js'
import {Link} from 'react-router-dom'
import { UserButton, useUser, useClerk } from '@clerk/clerk-react'
import { AppContext } from '../../context/context.js';
const NavBar = () => {
    const isCourseListPage = location.pathname.includes('/course-list')
    const {navigate, isEducator} = useContext(AppContext)
    const {openSignIn} = useClerk()
    const {user} = useUser()

    return (
        <div className={`flex justify-between items-center px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
            <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-28 ld:w-32 cursor-pointer' />
            <div className='hidden md:flex items-center gap-5'>
                <div className='flex items-center gap-5'>
                { 
                    user && <>
                    <button onClick={()=> navigate('/educator')} className='cursor-pointer'>{isEducator ? 'Educator Dashboard' : 'Become Educator'} </button> | <Link to='/my-enrollments'>My Enrollments</Link>
                    </>
                }
                </div>
                {   
                    user? <UserButton/> :
                    <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 rounded-full py-2 cursor-pointer'>Create Account</button>
                }
            </div>
            <div className='md:hidden flex items-center text-gray-500 gap-2 sm:gap-5'>
                <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
                { 
                    user && <>
                    <button onClick={()=> navigate('/educator')} className='cursor-pointer'> {isEducator ? 'Educator Dashboard' : 'Become Educator'} </button> | <Link to='/my-enrollments'>My Enrollments</Link>
                    </>
                }
                </div>
                {   
                    user ? <UserButton/> :
                    <button className='cursor-pointer' onClick={() => openSignIn()}>
                        <img src={assets.user_icon} alt="" />
                    </button>
                    
                }
            </div>
        </div>
    );
};

export default NavBar;