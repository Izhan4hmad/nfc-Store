import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconGoogle from '../../components/Icon/IconGoogle';
import { useUserInfo } from '../../context/user';
import { useAppServices } from '../../hook/services';
import localforage from 'localforage';
import './style.css';
import logo from '../../assets/images/login/logo.webp';

const LoginBoxed = () => {
    const dispatch = useDispatch();
    const Service = useAppServices();
    const { Update } = useUserInfo();
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState();
    const [userData, setuserData] = useState<any>(null);
    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });
    const navigate = useNavigate();
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    const submitForm = async (e: any) => {
        e.preventDefault();
        const payload = {
            email: e.target.email.value,
            password: e.target.password.value,
        };
        const { response, error } = await Service.auth.login({ payload });
        setProcessing(false);
        if (error) return setMessage(error.message);
        if (response?.data?.by_pass_2fa === 1) {
            setuserData(response.data);
            // const email = encodeURIComponent(response.data.email);
            // navigate(`/auth/otp-verify?email=${email}`);
            return;
        }

        // Set locally
        const { token, ...user } = response.data;
        localforage.setItem('token', token);
        localforage.setItem('user', response.data);

        Update(response.data);
        // return response ? navigate(`/home`) : '';
    };
    const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 3) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };
    const handleOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length === 4) {
            console.log('OTP Submitted:', code);
            const payload = {
                otp: code,
                email: userData.email,
            };
            const { response, error } = await Service.auth.verify_otp({ payload });
            if (error) return setMessage(error.message);
            const { token, ...user } = userData;
            localforage.setItem('token', token);
            localforage.setItem('user', response.data);

            Update(userData);
        } else {
            alert('Please enter all 4 digits of the OTP.');
        }
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
                                <h1 className="text-[22px] font-extrabold !leading-snug">Sign In</h1>
                                <p className="text-base font-bold leading-normal text-white-dark mt-[10px]">Your SMS Provider</p>
                            </div>
                            {userData?.email ? (
                                <form onSubmit={handleOTP} className="flex flex-col items-center gap-6">
                                    <div className="flex gap-4">
                                        {otp.map((digit, i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleChange(i, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, i)}
                                                ref={(el) => (inputsRef.current[i] = el)}
                                                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        disabled={otp.join('').length != 4}
                                        type="submit"
                                        className="mt-4 bg-indigo-600 text-white font-medium px-6 py-2 rounded-full hover:bg-indigo-700 transition-all"
                                    >
                                        Verify OTP
                                    </button>
                                </form>
                            ) : (
                                <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                    <div>
                                        <div className="relative text-white-dark">
                                            <input name="email" id="Email" type="email" placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark !pl-[13px] !py-[10px]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="relative text-white-dark">
                                            <input
                                                name="password"
                                                id="Password"
                                                type="password"
                                                placeholder="Enter Password"
                                                className="form-input ps-10 mb-[.75rem] placeholder:text-white-dark !pl-[13px] !py-[10px]"
                                            />
                                        </div>
                                    </div>

                                    <span onClick={() => navigate('/forgot-password')} className="text-[13px] text-[#1C84FF] justify-end flex !mt-0 cursor-pointer font-medium">
                                        Forgot Password ?
                                    </span>

                                    {/* <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                                        <span className="text-white-dark">Subscribe to weekly newsletter</span>
                                    </label>
                                </div> */}
                                    <button type="submit" className="btn hover:bg-[#056EE9] bg-[#1B84FF] text-white py-3 !mt-6 mb-[2.5rem] w-full border-0 ">
                                        Sign in
                                    </button>

                                    <div className="text-[13px] text-[#99A1B7] text-center font-medium">
                                        Not a Member yet?{' '}
                                        <span onClick={() => navigate('/auth/sign-up')} className=" text-[#1C84FF] cursor-pointer">
                                            Sign up
                                        </span>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
