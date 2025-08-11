import { FC } from 'react';

interface IconDisabledProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconDisabled: FC<IconDisabledProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle opacity={duotone ? '0.5' : '1'} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="4.22" y1="4.22" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M16 10a4 4 0 00-8 0 4 4 0 008 0z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle opacity={duotone ? '0.5' : '1'} cx="10" cy="10" r="9" fill="currentColor" />
                    <line x1="3.31" y1="3.31" x2="16.69" y2="16.69" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M14 8a4 4 0 00-8 0 4 4 0 008 0z" fill="white" />
                </svg>
            )}
        </>
    );
};

export default IconDisabled;
