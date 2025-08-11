import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/login/logo.webp';
import './style.css';
import { useAppServices } from '../../hook/services';
import Swal from 'sweetalert2';
import { useState, FormEvent } from 'react';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    repeatPassword?: string;
    terms?: string;
}

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    created_through: string;
}

const RegisterBoxed = () => {
    const navigate = useNavigate();
    const AppService = useAppServices();

    const [errors, setErrors] = useState<FormErrors>({});

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = (formData.get('name') as string).trim();
        const email = (formData.get('email') as string).trim();
        const password = (formData.get('password') as string).trim();
        const repeatPassword = (formData.get('repeatPassword') as string).trim();
        const termsAccepted = formData.get('terms') === 'on';

        const newErrors: FormErrors = {};

        if (!name) newErrors.name = "Name is required.";
        if (!email) newErrors.email = "Email is required.";
        if (!password) newErrors.password = "Password is required.";
        if (!repeatPassword) newErrors.repeatPassword = "Repeat Password is required.";
        if (password && repeatPassword && password !== repeatPassword) newErrors.repeatPassword = "Passwords do not match.";
        if (!termsAccepted) newErrors.terms = "You must accept the terms.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        const payload: RegisterPayload = {
            name,
            email,
            password,
            created_through: 'Signup'
        };

        try {
            const { response } = await AppService.user.create({ payload });

            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User registered successfully.',
                });
                navigate('/auth/sign-in');
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: err?.message || 'Something went wrong.',
            });
        }
    };

    return (
        <div className="relative flex md:flex-row flex-col min-h-screen login_bg_image items-center justify-between px-6 py-10 dark:bg-[#060818] sm:px-10">
            <div className='w-full flex items-center justify-center'>
                <img src={logo} alt="logo" className='w-[150px] md:w-[300px] mb-[2.5rem] md:mb-[0px]' />
            </div>

            <div className="relative w-full max-w-[600px] rounded-xl">
                <div className="relative flex flex-col justify-center rounded-2xl backdrop-blur-lg bg-[#FFFFFF] px-6 lg:min-h-[560px] py-20">
                    <div className="mx-auto w-full max-w-[400px]">
                        <div className="mb-[2.75rem] text-center">
                            <h1 className="text-[22px] font-extrabold !leading-snug">Sign Up</h1>
                            <p className="text-base font-bold leading-normal text-white-dark mt-[10px]">Your SMS Provider</p>
                        </div>
                        <form className="dark:text-white" onSubmit={submitForm}>
                            <div className='mb-4'>
                                <input name="name" type="text" placeholder="Name" className="form-input !pl-[13px] !py-[10px]" />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className='mb-4'>
                                <input name="email" type="email" placeholder="Email" className="form-input !pl-[13px] !py-[10px]" />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div className='mb-4'>
                                <input name="password" type="password" placeholder="Password" className="form-input !pl-[13px] !py-[10px]" />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <span className='text-sm mb-2 text-[#99A1B7] flex'>
                                Use 8 or more characters with a mix of letters, numbers & symbols.
                            </span>

                            <div className='mb-4'>
                                <input name="repeatPassword" type="password" placeholder="Repeat Password" className="form-input !pl-[13px] !py-[10px]" />
                                {errors.repeatPassword && <p className="text-red-500 text-xs mt-1">{errors.repeatPassword}</p>}
                            </div>

                            <div className="mb-6 flex items-center">
                                <input type="checkbox" id="terms" name="terms" className="mr-2 w-[23px] h-[23px] rounded-md accent-blue-500" />
                                <label htmlFor="terms" className="text-sm text-gray-600">I Accept the <span className="text-[#1B84FF] hover:underline">Terms</span></label>
                            </div>
                            {errors.terms && <p className="text-red-500 text-xs mt-[-18px] mb-4">{errors.terms}</p>}

                            <button type="submit" className="btn hover:bg-[#056EE9] bg-[#1B84FF] text-white py-3 !mt-6 mb-[2.5rem] w-full border-0">
                                Sign Up
                            </button>

                            <div className='text-[13px] text-[#99A1B7] text-center font-medium'>
                                Already have an Account? <span onClick={() => navigate('/auth/sign-in')} className=' text-[#1C84FF] cursor-pointer'>Sign in</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterBoxed;
