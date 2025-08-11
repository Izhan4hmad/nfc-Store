import { FC } from 'react';

interface IconSaasProps {
    className?: string;
}

const IconSaas: FC<IconSaasProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                d="M12 6C8.13401 6 5 9.13401 5 12C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 12C19 9.13401 15.866 6 12 6ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            />
            <path d="M12 18C13.1046 18 14 18.8954 14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18Z" fill="none" stroke="currentColor" stroke-width="2" />
        </svg>
    );
};

export default IconSaas;
