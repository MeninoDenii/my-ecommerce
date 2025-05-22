import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`px-2 rounded-md w-fit flex cursor-pointer ${
        variant === "primary"
          ? "bg-blue-500 text-white"
          : variant === "secondary"
          ? "bg-gray-500 text-white"
          : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};
