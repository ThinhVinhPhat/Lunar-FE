import { Link } from "react-router-dom";
import logo from "@/lib/assets/logo.png";

const Logo = () => {
  return (
    <Link to="/" className="text-2xl font-bold">
      <img src={logo} alt="logo" className="w-28 h-16" />
    </Link>
  );
};

export default Logo;
