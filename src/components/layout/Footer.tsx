import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faPinterestP,
  faVimeoV,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2c2c2c] text-white">
      {/* Newsletter Section */}
      <div className="bg-[#C8A846] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="mb-6 text-sm">
              Be the first to know about new collections and exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-2 bg-[#2c2c2c] text-white rounded-md hover:bg-black transition-colors duration-300">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* About Column */}
          <div>
            <h4 className="font-bold text-lg mb-6">About Shwood</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/our-story"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  to="/process"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  Our Process
                </Link>
              </li>
              <li>
                <Link
                  to="/sustainability"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-lg mb-6">Customer Care</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/warranty"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-[#C8A846]" />
                <span>(503) 367-9252</span>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-[#C8A846]" />
                <a
                  href="mailto:info@shwoodshop.com"
                  className="hover:text-[#C8A846] transition-colors"
                >
                  info@shwoodshop.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-[#C8A846] mt-1"
                />
                <div>
                  <p>729 SE Grant St</p>
                  <p>Portland, OR 97214</p>
                </div>
              </li>
              <li className="text-sm text-gray-400">
                <p>Customer Service Hours:</p>
                <p>9AM–3PM PST, Mon–Fri</p>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Connect With Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[#C8A846] hover:border-[#C8A846] transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[#C8A846] hover:border-[#C8A846] transition-colors"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[#C8A846] hover:border-[#C8A846] transition-colors"
              >
                <FontAwesomeIcon icon={faPinterestP} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-[#C8A846] hover:border-[#C8A846] transition-colors"
              >
                <FontAwesomeIcon icon={faVimeoV} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {currentYear} Shwood Eyewear. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                to="/terms"
                className="hover:text-[#C8A846] transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/privacy"
                className="hover:text-[#C8A846] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/accessibility"
                className="hover:text-[#C8A846] transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
