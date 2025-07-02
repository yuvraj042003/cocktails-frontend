import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-muted-foreground text-sm">
              Cocktails is Rewa's premier destination for fine cocktails, craft
              beers, and exceptional dining experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/menu"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/book"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Book a Table
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Main Street</li>
              <li>Rewa, Madhya Pradesh</li>
              <li>Phone: +91 1234567890</li>
              <li>Email: info@cocktails.com</li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Opening Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Monday - Thursday: 11am - 10pm</li>
              <li>Friday - Saturday: 11am - 11pm</li>
              <li>Sunday: 12pm - 9pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Cocktails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 