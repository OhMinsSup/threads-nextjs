import React from "react";

interface MainHeaderProps {
  children: React.ReactNode;
}

export default function MainHeader({ children }: MainHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 items-center justify-between sm:h-20 sm:py-6">
          {children}
        </div>
      </div>
    </header>
  );
}
