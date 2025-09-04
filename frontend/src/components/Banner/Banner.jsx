import { useState } from "react";
import { FaDownload, FaPlay, FaSearch, FaTimes } from "react-icons/fa";
import { bannerAssets } from "../../assets/dummydata";
import { FaX } from "react-icons/fa6";

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const { bannerImage, orbitImages, video } = bannerAssets;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };
  return (
    <div className="relative">
      <div className="bg-light-background text-text-primary py-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          {/* LEFT CONTENT */}
          <div className="flex-1 space-y-8 relative md:pr-8 lg:pr-19 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md">
              We're Here <br />
              <span className="text-primary bg-gradient-to-r from-primary to-primary-dark bg-clip-text">
                To Satisfy Your Cravings
              </span>
            </h1>

            <p className="text-lg md:text-lg lg:text-xl font-playfair italic sm:text-xl text-text-secondary max-w-xl opacity-90 mx-auto md:mx-0">
              Your satisfaction is our priority. Enjoy a seamless dining
              experience with us.
            </p>

            <form
              onSubmit={handleSearch}
              className="relative max-w-7xl mx-auto md:mx-0 group"
            >
              <div className="relative flex items-center bg-white rounded-full border-2 border-border shadow-lg hover:border-primary/50 transition-all duration-300">
                <div className="pl-6 pr-3 py-4">
                  <FaSearch className="text-primary/80 text-xl" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Discover your next favorite meal..."
                  className="w-full py-4 pr-6 bg-transparent outline-none placeholder:text-text-secondary/70 placeholder:text-base
              sm:placeholder:text-lg text-lg font-medium tracking-wide"
                />
                <button type="submit" className="mr-3 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark rounded-full font-semibold text-dark-accent hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-primary/20">
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-6">
              {/* <button className="group flex items-center gap-3 bg-primary-dark/30 hover:bg-primary-dark/50 px-6 py-3 rounded-xl transition-all duration-300 border-2 border-primary-dark/50 hover:border-primary backdrop-blur-sm ">
                <FaDownload className="text-primary text-xl group-hover:animate-bounce" />
                <span className="text-light-background font-semibold group-hover:text-white">
                  Download App
                </span>
              </button> */}

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-3 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/30"
              >
                <FaPlay className="text-xl text-dark-accent" />
                <span className="text-dark-accent font-semibold">
                  Watch Video
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT IMAGES CONTAINER WITH ORBITAL IMAGES */}
          <div className="flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px] ">
            {/* MAIN IMAGE */}
            <div className="relative rounded-full p-1 bg-gradient-to-br from-primary-dark via-primary to-primary shadow-2xl z-20 w-[250px] xs:[300px] sm:w-[350px] h-[250px] xs:h-[300px] sm:h-[350px] mx-auto">
              <img
                src={bannerImage}
                className="rounded-full border-4 xs:border-8 border-dark-accent/50 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-dark-accent/40 mix-blend-multiply" />
            </div>

            {/* ORBITAL IMAGES */}
            {orbitImages.map((imgSrc, index) => (
              <div
                key={index}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  index === 0 ? "orbit" : `orbit-delay-${index * 5}`
                } w-[80px] xs:w-[100px] sm:w-[150px] h-[80px] xs:h-[100px] sm:h-[150px]`}
              >
                <img
                  src={imgSrc}
                  alt={`Orbiting ${index + 1}`}
                  className="w-full h-full rounded-full border border-primary/30 shadow-lg bg-primary-dark/20 p-1 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-lg p-4">
          <button onClick={() => setShowVideo(false)} className="absolute top-6 right-6 text-primary hover:text-primary-dark text-3xl z-10 transition-all">
            <FaTimes />
          </button>
          <div className="w-full max-w-4xl mx-auto">
            <video controls autoPlay className="w-full aspect-video object-contain rounded-lg shadow-2xl">
              <source src={video} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
