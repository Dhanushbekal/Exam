import React from 'react';

interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ModalButton: React.FC<ModalButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
};

export default ModalButton; 