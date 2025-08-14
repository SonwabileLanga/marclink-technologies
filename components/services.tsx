import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Laptop, Tv, Wifi, HardDrive, Shield, Home, Building, Clock, CheckCircle } from "lucide-react"

const services = [
  {
    icon: Smartphone,
    title: "Mobile & Tablet Repairs",
    description: "Screen replacement, battery, charging ports, cameras, water damage repair",
    features: ["Same-day service", "All brands supported", "Warranty included"],
    color: "bg-blue-600",
  },
  {
    icon: Laptop,
    title: "Laptop & Desktop Repairs",
    description: "Hardware upgrades, virus removal, OS installs, data recovery",
    features: ["Performance upgrades", "Data recovery", "Virus removal"],
    color: "bg-green-600",
  },
  {
    icon: Tv,
    title: "TV & Home Electronics",
    description: "Smart TV setup, wall mounting, calibration, repair services",
    features: ["Wall mounting", "Smart TV setup", "Calibration"],
    color: "bg-purple-600",
  },
  {
    icon: Wifi,
    title: "Networking Solutions",
    description: "Wi-Fi setup, network troubleshooting, router configuration",
    features: ["Wi-Fi optimization", "Network security", "Business solutions"],
    color: "bg-orange-600",
  },
  {
    icon: HardDrive,
    title: "Data Recovery & Backup",
    description: "Recover lost files, setup secure backups, cloud solutions",
    features: ["High success rate", "Secure handling", "Cloud backup"],
    color: "bg-red-600",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Antivirus installation, malware removal, security consultation",
    features: ["Threat protection", "Security audits", "Safe browsing"],
    color: "bg-indigo-600",
  },
]

const supportTypes = [
  {
    icon: Building,
    title: "In-Store Service",
    description: "Visit our Mossel Bay location for hands-on repairs and consultations",
  },
  {
    icon: Home,
    title: "On-Site Visits",
    description: "We come to your home or office for convenient service",
  },
  {
    icon: Wifi,
    title: "Remote Support",
    description: "Get help online for software issues and installations",
  },
]

export function Services() {
  return (
    <section id="services" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-6 tracking-tight">
            Complete Tech Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From quick repairs to comprehensive IT solutions, we handle all your technology needs with expertise and
            care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-2xl transition-all duration-500 group bg-white border-0 shadow-lg"
            >
              <div className="space-y-6">
                <div
                  className={`w-16 h-16 ${service.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gray-50 rounded-3xl p-12 lg:p-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-serif font-light text-gray-900 mb-6 tracking-tight">
              How We Serve You
            </h3>
            <p className="text-gray-600 text-lg">
              Choose the service option that works best for your schedule and needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {supportTypes.map((type, index) => (
              <div key={index} className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto">
                  <type.icon className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-serif font-medium text-gray-900">{type.title}</h4>
                <p className="text-gray-600 leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-6">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Operating Hours: 8:00 AM - 8:00 PM</span>
            </div>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-base font-medium"
            >
              Schedule Service Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
