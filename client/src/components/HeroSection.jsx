import { ArrowRight, Calendar1Icon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import b1 from "../assets/b1.png";

const HeroSection = () => {
    const navigate=useNavigate();
  return (

    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen' 
    style={{ backgroundImage: `url(${b1})` }}>
      
      {/* <img
        // src="/marvelLogo.svg"

        alt="Marvel Logo"
        className="max-h-11 lg:h-11 mt-20"
      /> */}
      <br /><br />

      <h1 className="text-5xl md:text-[70px] md:leading-[4.5rem] font-semibold max-w-[110ch]">
        Dandiya Night
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span>Action | Adventure | Enjoyment</span>

        <div className="flex items-center gap-1">
          <Calendar1Icon className="w-4 h-4" /> 2025
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4" /> 2h 30m
        </div>
      </div>
      <p className="max-w-md text-gray-300">
        Join us for Dandiya Night 2025 – an evening full of music, dance, and festive vibes. 
        Dress up, pick up your dandiya sticks, and celebrate the joy of togetherness!
      </p>
      <button onClick={()=>navigate('/events')} className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:big-primary-dull transition rounded-full font-medium cursor-pointer">
        Explore Events
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeroSection;
