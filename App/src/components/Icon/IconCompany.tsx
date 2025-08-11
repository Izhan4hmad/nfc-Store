import { FC } from 'react';

interface IconCompanyProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconCompany: FC<IconCompanyProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect opacity={duotone ? '0.5' : '1'} x="3" y="4" width="18" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="6" y="7" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="7" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="6" y="13" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="13" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <rect opacity={duotone ? '0.5' : '1'} x="2" y="3" width="16" height="14" rx="2" ry="2" fill="currentColor" />
                    <rect x="5" y="5" width="3" height="3" fill="white" />
                    <rect x="12" y="5" width="3" height="3" fill="white" />
                    <rect x="5" y="10" width="3" height="3" fill="white" />
                    <rect x="12" y="10" width="3" height="3" fill="white" />
                </svg>
            )}
        </>
    );
};

export default IconCompany;
