import logo from "../../assets/logo.png";

const Logo = () => {
  return (
    <a href="/" className="text-2xl font-bold">
      <img src={logo} alt="logo" className="w-28 h-16" />
    </a>
  );
};

export default Logo; 