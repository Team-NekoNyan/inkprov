import React from "react";
import { Feather } from "lucide-react";

const Footer: React.FC = function Footer() {
  return (
    <footer className="flex justify-between relative pt-4 before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:w-screen before:h-px before:bg-primary-border">
      {/* Logo */}
      <div className="flex gap-4 items-center text-primary-text">
        <Feather />
        <a href="/" className="text-xl font-bold">
          Inkprov
        </a>
      </div>
      {/* Side Links */}
      <div className="flex gap-4 items-center text-primary-text">
        <a href="/about" className="text-md hover:text-hover-text">
          About
        </a>
        <a href="/privacy" className="text-md hover:text-hover-text">
          Privacy
        </a>
        <a href="/terms" className="text-md hover:text-hover-text">
          Terms
        </a>
        <a href="/contact" className="text-md hover:text-hover-text">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
