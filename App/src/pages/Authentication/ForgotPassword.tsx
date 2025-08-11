import React from 'react';
import './style.css';
import logo from '../../assets/images/login/logo.webp';
import { useNavigate } from 'react-router-dom';
import { useAppServices } from '../../hook/services';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const Service = useAppServices();
    const submitForm = async (e: any) => {
        e.preventDefault();
        const email = e.target.email.value;
        const { response, error } = await Service.user.forgot_password({ payload: { email: email } });
    };

    return (
        <div>
            <div className="relative flex md:flex-row flex-col min-h-screen login_bg_image items-center justify-between px-6 py-10 dark:bg-[#060818] sm:px-10">
                <div className="w-full flex items-center justify-center">
                    <img src={logo} alt="logo" className="w-[150px] md:w-[300px] mb-[2.5rem] md:mb-[0px]" />
                </div>

                <div className="relative w-full max-w-[600px] rounded-xl">
                    <div className="relative flex flex-col justify-center rounded-2xl backdrop-blur-lg bg-[#FFFFFF] px-6 lg:min-h-[560px] py-20">
                        <div className="mx-auto w-full max-w-[400px]">
                            <div className="mb-[2.75rem] text-center">
                                <h1 className="text-[22px] font-extrabold !leading-snug">Forgot Password ?</h1>
                                <p className="text-base font-bold leading-normal text-white-dark mt-[10px]">Enter your email to reset your password.</p>
                            </div>
                            <form className="space-y-4 dark:text-white" onSubmit={submitForm}>
                                <div className="relative text-white-dark">
                                    <input name="email" id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark !pl-[13px] !py-[10px]" />
                                </div>

                                <div className="flex justify-center items-center">
                                    <button type="submit" className="btn hover:bg-[#056EE9] bg-[#1B84FF] text-white py-3 !mt-6 mb-[2.5rem] w-fit border-0 ">
                                        Submit
                                    </button>

                                    <button onClick={() => navigate('/auth/sign-in')} className="btn hover:bg-[#F1F1F4] bg-[#F9F9F9] shadow-none ml-4  py-3 !mt-6 mb-[2.5rem] w-fit border-0 ">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
