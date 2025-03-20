function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Admin Dashboard. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
export default Footer;
