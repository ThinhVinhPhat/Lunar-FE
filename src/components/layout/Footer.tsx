import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* About Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Our Process
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Time Well Spent
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  My Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Track My Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Warranty
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  FAQ/Help
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Wholesale
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Military & First Responders
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Vimeo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-2">
              <p>Customer Service:</p>
              <p className="text-lg">(503) 367-9252</p>
              <p className="text-sm text-gray-400">9–3 PST, Mon–Fri</p>
              <p className="mt-4">729 SE Grant St</p>
              <p>Portland OR 97214</p>
              <p className="mt-4">info@shwoodshop.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2025 Shwood Eyewear</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white">
              Accessibility
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white">
              Do not sell my personal information
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
