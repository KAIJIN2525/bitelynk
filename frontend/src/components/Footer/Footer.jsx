import { useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { BiChevronRight } from "react-icons/bi";
import { toast } from "sonner";
import { socialIcons } from "../../assets/dummydata";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Menu", link: "/menu" },
  { name: "About Us", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (!email) {
      toast.error("Please enter a valid email address.", { duration: 3000 });
      return;
    }
    toast.success(
      `Thank you for subscribing! We'll send you updates to ${email}.`,
      { duration: 4000 }
    );
    setEmail("");
  };

  return (
    <footer className="bg-dark-accent text-light-background py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <h2 className="text-4xlsm:text-5xl md:text-5xl font-bold font-sacramento text-primary animate-pulse">
              BiteLynk
            </h2>

            <p className="text-light-background/90 text-base font-sacramento italic">
              When culinary artistry meets doorstep convenience <br />
              Savor handcrafted perfection, delivered with care.
            </p>

            <form onSubmit={handleSubmit} className="relative mt-4 group">
              <div className="flex items-center gap-2 mb-2">
                <FaRegEnvelope className="text-primary animate-pulse" />
                <span className="font-bold text-">Get Exclusive Offers</span>
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-primary/30 rounded-md py-2.5 px-4 w-full bg-primary/5 text-light-background placeholder-light-background/50 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 transition-all duration-300 pr-24 "
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-gradient-to-br from-primary to-primary-dark text-white px-4 py-2 rounded-md flex items-center gap-1.5 shadow-lg hover:shadow-primary/30 overflow-hidden transition-all duration-500"
                >
                  <span className="font-bold text-sm tracking-wide transition-transform duration-300 group-hover:-translate-x-1">
                    Subscribe
                  </span>
                  <BiChevronRight className="text-xl transition-transform duration-300 group-hover:animate-spin flex-shrink-0" />
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-light-background/30 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </form>
          </div>

          {/* MIDDLE COLUMN */}
          <div className="flex justify-start sm:justify-center">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 border-l-4 border-primary pl-3 font-merriweather italic text-primary">
                Navigation
              </h3>

              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.link}
                      className="flex items-center hover:text-primary transition-all group font-lora hover:pl-2 duration-300"
                    >
                      <BiChevronRight className="mr-2 text-primary group-hover:animate-bounce" />
                      <span className="hover:italic">{item.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex justify-start md:justify-end">
            <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4 border-l-4 border-primary pl-3 font-merriweather italic text-primary">
                    Contact Us
                </h3>
                <div className="space-x-4 flex">
                    {socialIcons.map(({icon : Icon, link, color, label},idx) => (
                        <a target="_blank" key={idx} href={link} className="text-2xl bg-primary/10 p-3 rounded-full hover:bg-primary/20 hover:scale-110 transition-all duration-300 relative group" style={{color}} >
                            <Icon className="hover:scale-125 transition-transform duration-300" />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-primary text-dark-accent px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t border-primary-dark pt-8 mt-8 text-center">
            <p className="text-primary text-lg mb-2">
                &copy; 2025 BiteLynk. All rights reserved
            </p>
            <div className="group inline-block">
                <a target="_blank" href="https://www.linkedin.com/in/david-ememem-733572238/" className="lext-lg font-sacramento bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent hover:texxt-purple-300 transition-all duration-500">Designed by Ghost</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
