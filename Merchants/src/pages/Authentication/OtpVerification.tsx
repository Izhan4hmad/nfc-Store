import React, { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const OtpVerification: React.FC = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length === 4) {
            console.log('OTP Submitted:', code);
            console.log('email: ', email)
        } else {
            alert('Please enter all 4 digits of the OTP.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] px-4">
            <div className='bg-white p-10 px-16 text-center rounded-md shadow-md'>
                <h2 className="text-xl font-bold mb-4">Enter the 4-digit OTP</h2>
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
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
                        type="submit"
                        className="mt-4 bg-indigo-600 text-white font-medium px-6 py-2 rounded-full hover:bg-indigo-700 transition-all"
                    >
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;
