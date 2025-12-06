import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
    return (
        <div classNameName=''>
            <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-white bg-[#111820] pt-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        <div className="sm:col-span-2 lg:col-span-1">
            <img src={assets.logo_dark} alt="" />
            <p className="text-sm/7 mt-6 text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</p>
        </div>
        <div className="flex flex-col lg:items-center lg:justify-center">
            <div className="flex flex-col text-sm space-y-2.5 text-left">
                <h2 className="font-semibold mb-5">Company</h2>
                <a className="hover:text-slate-600 transition" href="#">Home</a>
                <a className="hover:text-slate-600 transition" href="#">About us</a>
                <a className="hover:text-slate-600 transition" href="#">Contact us</a>
                <a className="hover:text-slate-600 transition" href="#">Privacy policy</a>
            </div>
        </div>
        <div>
            <h2 className="font-semibold mb-5 text-left">Subscribe to our newsletter</h2>
            <div className="text-sm space-y-6 max-w-sm">
                <p className='text-left'>The latest news, articles, and resources, sent to your inbox weekly.</p>
                <div className="flex items-center  gap-2 rounded-md ">
                    <input className="focus:ring-2 bg-[#1F2937] ring-blue-300 outline-none w-full max-w-64 py-2 rounded px-2" type="email" placeholder="Enter your email"/>
                    <button className="bg-blue-600 px-4 py-2 text-white rounded">Subscribe</button>
                </div>
            </div>
        </div>
    </div>
    <p className="py-4 text-center border-t mt-6 border-slate-50">
        Copyright 2025 © <a href="https://prebuiltui.com">Edemy</a> All Right Reserved.
    </p>
</footer>
        </div>
    );
};

export default Footer;