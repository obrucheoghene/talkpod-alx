import React from 'react'

interface ActionButtonProps {
    text: string;
    type?: "button" | "submit" | "reset" | undefined;
    variant?: 'full' | 'outline';
    color?: string;
    onClick?: () => void;
}
const ActionButton: React.FC<ActionButtonProps> = ({ text, type = "button", variant = "full", color = "violet", onClick }) => {
    const textColor = `text-${color}-500 `;
    const textHoverColor = `hover:text-${color}-600 `;
    const bgColor = `bg-${color}-500 `;
    const bgHoverColor = `hover:bg-${color}-600 `;
    const borderColor = `border-${color}-500 `;
    const borderHoverColor = `border-${color}-600 `;
    return (
        <button onClick={onClick} type={type} className={`
    ${variant === 'full' ? 'text-white ' : textColor} 
    ${variant === 'full' ? bgColor : 'bg-white '} 
    ${variant === 'full' ? '' : textHoverColor} 
    ${variant === 'full' ? bgHoverColor : ''} 
    ${borderColor} ${borderHoverColor} border-2
     font-medium rounded-lg text-sm px-4 py-2 
     text-center md:mr-0 outline-none cursor-pointer`}>
            {text}
        </button>

    )
}

export default ActionButton
