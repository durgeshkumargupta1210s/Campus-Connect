import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // Importing logo/assets
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react"; // Icons from lucide-react
import { useClerk, UserButton, useUser } from "@clerk/clerk-react"; // Clerk authentication

const Navbar = () => {
  // State to control mobile menu open/close
  const [isOpen, setIsOpen] = useState(false);

  // Clerk hooks: user info & sign-in function
  const { user } = useUser();
  const { openSignIn } = useClerk();

  // For programmatic navigation
  const navigate = useNavigate();

  return (
    // Navbar container (fixed at top, spans full width)
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-transparent">
      {/* Logo on the left - redirects to home */}
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="Logo" className="w-36 h-auto" />
      </Link>

      {/* Navigation links container */}
      <div
        className={`
          max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium 
          max-md:text-lg z-50 flex flex-col md:flex-row items-center 
          max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen 
          min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 
          md:border min-md:border-gray-300/20 overflow-hidden 
          transition-[transform] duration-300

          /* Slide-in / slide-out menu on mobile */
          ${isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        {/* Close icon inside mobile menu */}
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          aria-label="Close menu"
          onClick={() => setIsOpen(false)} // Close the mobile menu
        />

        {/* Navigation links - close menu on click */}
        <Link onClick={() => setIsOpen(false)} to="/">
          Home
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/movies">
          Movies
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/theaters">
          Theaters
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/releases">
          Releases
        </Link>
        <Link onClick={() => setIsOpen(false)} to="/favorite">
          Favorites
        </Link>
      </div>

      {/* Right-side section */}
      <div className="flex items-center gap-8">
        {/* Search icon (hidden on mobile) */}
        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

        {/* If not logged in -> show login button */}
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          // If logged in -> show Clerk user profile button
          <UserButton>
            <UserButton.MenuItems>
              {/* ✅ FIXED: `onClick` must be lowercase */}
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-booking")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      {/* Hamburger menu icon (only on mobile) */}
      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        aria-label="Open menu"
        onClick={() => setIsOpen(true)} // Opens mobile menu
      />
    </div>
  );
};

export default Navbar;
