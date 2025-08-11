import { FC } from 'react';

interface IconMenuDashboardProps {
    className?: string;
}

const IconMenuDashboard: FC<IconMenuDashboardProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M3 3H21V21H3V3Z" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M3 9H21" stroke="currentColor" stroke-width="2" />
            <path d="M3 15H21" stroke="currentColor" stroke-width="2" />
        </svg>
    );
};

export default IconMenuDashboard;
