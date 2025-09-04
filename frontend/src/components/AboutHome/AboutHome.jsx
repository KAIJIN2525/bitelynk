import { Link } from "react-router-dom";
import { aboutfeature } from "../../assets/dummydata";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import AboutImage from "../../assets/AboutImage.png"; // Adjust the path as necessary
import FloatingParticle from "../FloatingParticle/FloatingParticle";
import "./AboutHome.css"; // Import your custom styles if needed

const AboutHome = () => {
  return (
    <div className="min-h-screen bg-light-background text-text-primary py-10 sm:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:gap-8 xl:gap-16 relative">
        <div className="w-full order-1 lg:order-2 space-y-8 sm:space-y-12 relative">
          <div className="text-3xl space-y-4 sm:space-y-8 px-4 sm:px-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
              <span className="font-cursive text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                Epicurean Elegance
              </span>
              <br />
              <span className="inline-block mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl opacity-90 font-light">
                Where Culinary Dreams Come True
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl font-serif italic border-l-4 border-primary pl-4 sm:pl-8 py-2 bg-primary/5">
              "In our kitchen, we don't just cook; we create experiences that
              linger in your memory. Every dish is a masterpiece, crafted with
              passion and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 px-4 sm:px-8">
            {aboutfeature.map((feature, index) => (
              <div key={index} className="flex flex-col items-center justify-center gap-3 sm:gap-4 transition-transform duration-300 p-4 sm:p-5 hover:translate-x-2">
                <div
                  className={` p-3 sm:p-4 rounded-full bg-gradient-to-br from-primary to-primary-dark transition-transform duration-300 group-hover:scale-110 `}
                >
                  <feature.icon className="text-2xl sm:text-3xl text-white" />
                </div>

                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold font-cursive">
                    {feature.title}
                  </h3>
                  <p className="opacity-80 text-sm sm:text-base">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center mt-6 sm:mt-8 px-4 sm:px-0">
            <Link
              to="/about"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:scale-[1.02] transition-transform duration-300 flex items-center gap-2 sm:gap-3 shadow-xl hover:shadow-primary/20 group relative overflow-hidden"
            >
              <FaInfoCircle className=" text-lg sm:text-xl animate-pulse" />
              <span className=" font-cursive text-lg sm:text-xl">
                Unveil Our Legacy
              </span>
            </Link>
          </div>
        </div>
        
        <div className="w-full order-2 lg:order-1 md:max-w-md lg:max-w-none lg:w-7/12 mt-12 mb-10 lg:mb-0 relative group transform hover:scale-[1.01] transition-all duration-500">
            <div className="relative rounded-[4rem] overflow-hidden border-4 border-primary-dark/30 hover:border-primary/40 transition duration-500 shadow-2xl shadow-black/50 ">
              <img src={AboutImage} alt="Restaurant" className="w-full h-auto object-cover aspect-[3/4] transform -rotate-1 hover:rotate-0 transition-all duration-500" />
            </div>
        </div>
      </div>

      <FloatingParticle />
    </div>
  );
};

export default AboutHome;
