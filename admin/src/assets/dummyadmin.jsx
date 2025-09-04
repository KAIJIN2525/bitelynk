import {
  FiHome,
  FiBox,
  FiPackage,
  FiUsers,
  FiUser,
  FiPlusCircle,
  FiList,
  FiLogOut,
  FiClock, // <-- Added missing import
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";

export const navLinks = [
  { name: "Dashboard", href: "/", icon: <FiHome /> },
  { name: "Products", href: "/products", icon: <FiBox /> },
  { name: "Orders", href: "/orders", icon: <FiPackage /> },
  { name: "Users", href: "/users", icon: <FiUsers /> },
  { name: "Profile", href: "/profile", icon: <FiUser /> },
  { name: "Add Items", href: "/add", icon: <FiPlusCircle /> },
  { name: "List Items", href: "/list", icon: <FiList /> },
];

// LIST CSS
export const styles = {
  pageWrapper:
    "min-h-screen bg-light-background py-12 px-4 sm:px-6 lg:px-8",
  cardContainer:
    "bg-white backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-border",
  title:
    "text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent text-center",
  tableWrapper: "overflow-x-auto",
  table: "w-full",
  thead: "bg-light-background",
  th: "p-4 text-left text-text-secondary",
  thCenter: "p-4 text-center text-text-secondary",
  tr: "border-b border-border hover:bg-primary/5 transition-colors",
  imgCell: "p-4",
  img: "w-50 h-30 object-contain rounded-lg",
  nameCell: "p-4",
  nameText: "text-text-primary font-medium text-lg",
  descText: "text-sm text-text-secondary",
  categoryCell: "p-4 text-text-secondary",
  priceCell: "p-4 text-primary font-medium",
  ratingCell: "p-4",
  heartsCell: "p-4",
  heartsWrapper: "flex items-center gap-2 text-primary",
  updateButton:
    "text-primary hover:text-primary-dark transition-colors p-2 rounded-lg hover:bg-primary/10",

  deleteBtn:
    "text-error hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-error/10",
  emptyState: "text-center py-12 text-text-secondary text-xl",

  // AddItems styles
  formWrapper:
    "min-h-screen bg-light-background py-10 px-4 sm:px-6 lg:px-8",
  formCard:
    "bg-white backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-border",
  formTitle:
    "text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent text-center",
  uploadWrapper: "flex justify-center",
  uploadLabel:
    "w-full max-w-xs sm:w-72 h-56 sm:h-72 bg-light-background border-2 border-dashed border-border rounded-2xl cursor-pointer flex items-center justify-center overflow-hidden hover:border-primary transition-all",
  uploadIcon: "text-3xl sm:text-4xl text-primary mb-2 mx-auto animate-pulse",
  uploadText: "text-primary text-sm",
  previewImage: "w-full h-full object-cover",
  inputField:
    "w-full bg-light-background border border-border rounded-xl px-4 py-3 sm:px-5 sm:py-4 focus:outline-none focus:border-primary text-text-primary",
  gridTwoCols: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6",
  relativeInput: "relative",
  nairaIcon:
    "absolute left-4 top-1/2 -translate-y-1/2 text-primary text-lg sm:text-xl",
  actionBtn:
    "w-full bg-gradient-to-r from-primary to-primary-dark text-white px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 mt-6",
  secondaryBtn:
    "w-full bg-transparent border-2 border-primary text-primary px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all hover:bg-primary/10 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 mt-6",

  // AdminNavbar styles
  navWrapper:
    "bg-dark-accent border-b-8 border-primary-dark/40 shadow-lg sticky top-0 z-50 font-vibes",
  navContainer: "max-w-7xl mx-auto px-4 flex justify-between items-center h-20",
  logoSection: "flex items-center space-x-3",
  logoIcon: "text-4xl text-primary",
  logoText: "text-2xl font-bold text-light-background tracking-wide",
  menuButton: "text-primary text-2xl lg:hidden",
  desktopMenu: "hidden lg:flex items-center space-x-4",
  navLinkBase:
    "flex items-center space-x-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
  navLinkActive: "bg-primary-dark/30 border-primary text-primary",
  navLinkInactive:
    "border-primary-dark/30 text-light-background hover:border-primary hover:bg-primary-dark/20",
  mobileMenu: "lg:hidden flex flex-col space-y-3 mt-4 pb-4",
};

// DummyData.jsx
// Centralized Tailwind CSS class definitions and style objects
export const iconMap = {
  FiClock: <FiClock className="text-lg" />,
  FiTruck: <FiTruck className="text-lg" />,
  FiCheckCircle: <FiCheckCircle className="text-lg" />,
};

// Status styles for order statuses
export const statusStyles = {
  pending: {
    color: "text-yellow-800",
    bg: "bg-warning",
    icon: "FiClock",
    label: "Pending",
    value: "pending",
    hideLabel: false,
  },
  processing: {
    color: "text-dark-accent",
    bg: "bg-primary",
    icon: "FiClock",
    label: "Processing",
    value: "processing",
    hideLabel: false,
  },
  out_for_delivery: {
    color: "text-blue-800",
    bg: "bg-blue-500",
    icon: "FiTruck",
    label: "Out for Delivery",
    value: "out_for_delivery",
    hideLabel: false,
  },
  delivered: {
    color: "text-green-800",
    bg: "bg-success",
    icon: "FiCheckCircle",
    label: "Delivered",
    value: "delivered",
    hideLabel: false,
  },
  cancelled: {
    color: "text-red-800",
    bg: "bg-error",
    icon: "FiClock",
    label: "Cancelled",
    value: "cancelled",
    hideLabel: false,
  },
  succeeded: {
    color: "text-green-800",
    bg: "bg-success",
    icon: "FiCheckCircle",
    label: "Completed",
    value: "succeeded",
    hideLabel: true,
  },
};

// Payment method label and classes
export const paymentMethodDetails = {
  cod: {
    label: "COD",
    class: "bg-warning/10 text-yellow-800 border-warning/50",
  },
  card: {
    label: "Credit/Debit Card",
    class: "bg-blue-500/10 text-blue-800 border-blue-500/50",
  },
  default: {
    label: "Online",
    class: "bg-success/10 text-green-800 border-success/50",
  },
};

// Table layout classes
export const tableClasses = {
  wrapper: "overflow-x-auto",
  table: "w-full",
  headerRow: "bg-light-background",
  headerCell: "p-4 text-left text-text-secondary",
  row: "border-b border-border hover:bg-primary/5 transition-colors group",
  cellBase: "p-4",
};

// Utility classes
export const layoutClasses = {
  page: "min-h-screen bg-light-background py-12 px-4 sm:px-6 lg:px-8",
  card: "bg-white backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-border",
  heading:
    "text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent text-center",
};
