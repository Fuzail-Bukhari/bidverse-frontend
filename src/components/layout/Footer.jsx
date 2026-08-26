import { Link } from "react-router-dom";
import { Gavel } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-dark-2 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Gavel className="text-gold-500 w-6 h-6" />
              <span className="text-xl font-bold font-heading gold-text">BidVerse</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The most trusted real-time auction platform. Bid, win, and sell with confidence.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {["Twitter", "GitHub", "Linkedin"].map((platform, i) => (
                <button
                  key={i}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:border-gold-500/50 transition-colors border border-white/10"
                >
                  <span className="text-gray-400 text-xs">{platform[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 font-heading">Platform</h4>
            <ul className="space-y-2">
              {["Auctions", "How it Works", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 font-heading">Legal</h4>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 BidVerse. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for auction enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;