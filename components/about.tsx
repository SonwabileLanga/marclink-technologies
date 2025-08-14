import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Clock, Shield } from "lucide-react"

const stats = [
  { icon: Clock, label: "Years Experience", value: "8+" },
  { icon: Users, label: "Happy Customers", value: "2000+" },
  { icon: Award, label: "Repairs Completed", value: "5000+" },
  { icon: Shield, label: "Warranty Coverage", value: "100%" },
]

const directors = [
  {
    name: "Sharelda Jolene Tserayi",
    role: "Co-Founder & Managing Director",
    description: "Leading business operations and customer relations with a focus on service excellence.",
  },
  {
    name: "Macdonald Tserayi",
    role: "Technical Director",
    description: "Overseeing all technical operations and ensuring the highest quality repairs and solutions.",
  },
]

export function About() {
  return (
    <section id="about" className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-gray-300 text-gray-600">
            About MARCLINK TECHNOLOGIES
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-6 tracking-tight">
            Your Local Tech Experts
            <br />
            <span className="font-medium">Since 2016</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            What started as a small phone repair shop has grown into a full-service technology solutions provider,
            officially registered with CIPC and trusted by thousands.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-8 text-center bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-serif font-light text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-24">
          <Card className="p-12 bg-white border-0 shadow-lg">
            <h3 className="text-2xl font-serif font-medium text-gray-900 mb-6">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To deliver fast, affordable, and reliable tech services to homes and businesses across South Africa. We
              believe technology should enhance your life, not complicate it.
            </p>
          </Card>
          <Card className="p-12 bg-white border-0 shadow-lg">
            <h3 className="text-2xl font-serif font-medium text-gray-900 mb-6">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              To be South Africa's most trusted and accessible tech service company, known for our expertise,
              transparency, and commitment to customer satisfaction.
            </p>
          </Card>
        </div>

        <div className="bg-white rounded-3xl p-12 lg:p-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-serif font-light text-gray-900 mb-6 tracking-tight">
              Meet Our Directors
            </h3>
            <p className="text-gray-600 text-lg">The experienced leadership behind MARCLINK TECHNOLOGIES</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {directors.map((director, index) => (
              <Card key={index} className="p-8 border-l-4 border-l-blue-600 bg-gray-50 border-0">
                <h4 className="text-xl font-serif font-medium text-gray-900 mb-3">{director.name}</h4>
                <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
                  {director.role}
                </Badge>
                <p className="text-gray-600 leading-relaxed">{director.description}</p>
              </Card>
            ))}
          </div>

          <div className="pt-12 border-t border-gray-200">
            <h4 className="text-2xl font-serif font-medium text-center mb-12 text-gray-900">Why We're Different</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h5 className="font-medium mb-2 text-gray-900">8+ Years Experience</h5>
                <p className="text-sm text-gray-600">Proven track record</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h5 className="font-medium mb-2 text-gray-900">Transparent Pricing</h5>
                <p className="text-sm text-gray-600">No hidden fees</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h5 className="font-medium mb-2 text-gray-900">Warranty Coverage</h5>
                <p className="text-sm text-gray-600">All repairs covered</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h5 className="font-medium mb-2 text-gray-900">Multiple Options</h5>
                <p className="text-sm text-gray-600">In-store, home, remote</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
