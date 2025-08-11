import { FC } from 'react';

interface IconFeedbackProps {
    className?: string;
}

const IconFeedback: FC<IconFeedbackProps> = ({ className }) => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <path
                d="M22 7C22 4.79086 20.2091 3 18 3C15.7909 3 14 4.79086 14 7C14 9.20914 15.7909 11 18 11C18.7281 11 19.4161 10.8351 20.0223 10.5655C20.6692 10.2634 21.116 9.57448 21.2045 8.88869L22 7Z"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            />
            <path d="M18 13C16.8954 13 16 13.8954 16 15C16 16.1046 16.8954 17 18 17C19.1046 17 20 16.1046 20 15C20 13.8954 19.1046 13 18 13Z" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M15 21H9L7 16H15L13 21" stroke="currentColor" stroke-width="2" />
        </svg>
    );
};

export default IconFeedback;
