import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Smartphone, Laptop, Tv, Wrench, Star, MapPin } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-blue-600">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Mossel Bay, Western Cape</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
                Expert Tech Repair & <span className="gradient-text">IT Solutions</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Professional technology repair services you can trust. Serving Mossel Bay since 2016 with reliable
                solutions for all your tech needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Get Quote Now
              </Button>
              <Link href="/repair-form">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 bg-transparent"
                >
                  Book Repair Service
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">8+ Years Experience</span>
              </div>
              <div className="text-gray-500 font-medium">CIPC Registered</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="service-card p-6 bg-white shadow-lg hover:shadow-xl border-0">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Mobile Repairs</h3>
                <p className="text-gray-600 text-sm">
                  Screen replacement, battery issues, charging ports, water damage recovery
                </p>
              </div>
            </Card>

            <Card className="service-card p-6 bg-white shadow-lg hover:shadow-xl border-0">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Laptop className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Laptop & PC</h3>
                <p className="text-gray-600 text-sm">
                  Hardware upgrades, virus removal, OS installation, data recovery
                </p>
              </div>
            </Card>

            <Card className="service-card p-6 bg-white shadow-lg hover:shadow-xl border-0">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Tv className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900">TV Services</h3>
                <p className="text-gray-600 text-sm">Wall mounting, setup, calibration, smart TV configuration</p>
              </div>
            </Card>

            <Card className="service-card p-6 bg-white shadow-lg hover:shadow-xl border-0">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Remote Support</h3>
                <p className="text-gray-600 text-sm">Software installation, network setup, remote troubleshooting</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
