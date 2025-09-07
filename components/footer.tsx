import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Smartphone, Laptop, Tv, Wifi } from "lucide-react"

const services = [
  { icon: Smartphone, label: "Mobile Repairs" },
  { icon: Laptop, label: "Laptop & PC" },
  { icon: Tv, label: "TV Services" },
  { icon: Wifi, label: "IT Solutions" },
]

const quickLinks = ["About Us", "Services", "Pricing", "FAQ", "Contact", "Book Repair"]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-medium text-lg">M</span>
              </div>
              <div>
                <h3 className="font-serif font-medium text-xl text-white">MARCLINK</h3>
                <p className="text-sm text-gray-400 -mt-1 tracking-wide">TECHNOLOGIES</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed max-w-md text-lg">
              Your trusted tech partner in Mossel Bay since 2016. We provide expert repairs and IT solutions with
              transparent pricing and reliable service.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">0796644820</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">info@marclink.co.za</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Mossel Bay, Western Cape</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">8:00 AM - 8:00 PM Daily</span>
              </div>
            </div>

            <Badge variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
              CIPC Registered: 2016/181633/07
            </Badge>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif font-medium text-lg text-white mb-8">Our Services</h4>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <service.icon className="w-4 h-4" />
                  <span>{service.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-medium text-lg text-white mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">© 2024 MARCLINK TECHNOLOGIES. All rights reserved.</div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </div>

              <div className="text-gray-400 text-sm">Built in Mossel Bay</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
