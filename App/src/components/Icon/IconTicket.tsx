import { FC } from 'react';

interface IconTicketProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconTicket: FC<IconTicketProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect opacity={duotone ? '0.5' : '1'} x="2" y="6" width="20" height="12" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="4" cy="12" r="1" fill="currentColor" />
                    <circle cx="20" cy="12" r="1" fill="currentColor" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect opacity={duotone ? '0.5' : '1'} x="1" y="5" width="18" height="10" rx="2" ry="2" fill="currentColor" />
                    <path
                        d="M6 8.5H14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <path
                        d="M6 11.5H14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    <circle cx="2.5" cy="10" r="0.75" fill="currentColor" />
                    <circle cx="17.5" cy="10" r="0.75" fill="currentColor" />
                </svg>
            )}
        </>
    );
};

export default IconTicket;
