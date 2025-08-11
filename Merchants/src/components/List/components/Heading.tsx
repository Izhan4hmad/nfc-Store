import React from 'react';

interface HeadingProps {
    text: string;
}

export default function Heading({ text }: HeadingProps) {
    return (
        <div>
            <p className="text-[16px] text-[#071437] mt-4 font-bold">{text}</p>
        </div>
    );
}
