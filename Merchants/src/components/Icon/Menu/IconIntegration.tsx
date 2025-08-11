import { FC } from 'react';

interface IconIntegrationProps {
    className?: string;
}

const IconIntegration: FC<IconIntegrationProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M12 12L20 12" stroke="currentColor" stroke-width="2" />
            <path d="M12 12L4 12" stroke="currentColor" stroke-width="2" />
            <path d="M12 12L12 20" stroke="currentColor" stroke-width="2" />
            <path d="M12 12L12 4" stroke="currentColor" stroke-width="2" />
        </svg>
    );
};

export default IconIntegration;
