import { FC } from 'react';

interface IconTimeProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconTime: FC<IconTimeProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            {!fill ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle opacity={duotone ? '0.5' : '1'} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 6V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
                    <circle opacity={duotone ? '0.5' : '1'} cx="10" cy="10" r="9" fill="currentColor" />
                    <path
                        d="M10 3.5C10.2761 3.5 10.5 3.72386 10.5 4V10.2929L13.6464 13.4393C13.8417 13.6346 13.8417 13.9512 13.6464 14.1464C13.4512 14.3417 13.1346 14.3417 12.9393 14.1464L9.5 10.7071V4C9.5 3.72386 9.72386 3.5 10 3.5Z"
                        fill="currentColor"
                    />
                </svg>
            )}
        </>
    );
};

export default IconTime;
