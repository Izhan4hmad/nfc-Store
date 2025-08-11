import { FC } from 'react';

interface IconHealthProps {
    className?: string;
}

const IconHealth: FC<IconHealthProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M12 21C12 21 8 16 5 13C3 10 3 6 5 4C7 2 10 4 12 6C14 4 17 2 19 4C21 6 21 10 19 13C16 16 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M16 11L12 15L8 11" stroke="currentColor" stroke-width="2" />
        </svg>
    );
};

export default IconHealth;
