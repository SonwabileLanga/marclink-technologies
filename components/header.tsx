"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm border-b border-blue-500">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Mon-Sat: 8AM - 8PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>163 Adriaan Ave, Mossel Bay 6500</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span className="font-semibold">0796644820</span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl">MARCLINK</h1>
              <p className="text-blue-100 text-sm">TECHNOLOGIES</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-blue-200 transition-colors font-medium">
              Home
            </a>
            <a href="#services" className="hover:text-blue-200 transition-colors font-medium">
              Services
            </a>
            <a href="#about" className="hover:text-blue-200 transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="hover:text-blue-200 transition-colors font-medium">
              Contact
            </a>
            <Link href="/repair-form">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6">Book Repair</Button>
            </Link>
          </nav>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="hover:text-blue-200 transition-colors font-medium">
                Home
              </a>
              <a href="#services" className="hover:text-blue-200 transition-colors font-medium">
                Services
              </a>
              <a href="#about" className="hover:text-blue-200 transition-colors font-medium">
                About
              </a>
              <a href="#contact" className="hover:text-blue-200 transition-colors font-medium">
                Contact
              </a>
              <Link href="/repair-form">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold w-full">Book Repair</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
