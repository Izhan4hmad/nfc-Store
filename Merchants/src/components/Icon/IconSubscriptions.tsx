import { FC } from 'react';

interface IconSubscriptionsProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconSubscriptions: FC<IconSubscriptionsProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect opacity={duotone ? '0.5' : '1'} x="2" y="3" width="20" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 8H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect opacity={duotone ? '0.5' : '1'} x="1" y="2" width="18" height="16" rx="2" ry="2" fill="currentColor" />
                    <path d="M1 6H19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="10" cy="11" r="2.5" stroke="white" strokeWidth="1.5" />
                </svg>
            )}
        </>
    );
};

export default IconSubscriptions;
