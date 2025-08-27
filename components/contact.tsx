"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Smartphone, Laptop, Tv, Wifi, Upload, CheckCircle } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "0796644820",
    description: "Call us for immediate support",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@marclink.co.za",
    description: "Send us your questions",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Mossel Bay, Western Cape",
    description: "Visit our service center",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "8:00 AM - 8:00 PM",
    description: "Monday to Sunday",
  },
]

const serviceTypes = [
  { icon: Smartphone, label: "Mobile & Tablet", value: "mobile" },
  { icon: Laptop, label: "Laptop & PC", value: "laptop" },
  { icon: Tv, label: "TV & Electronics", value: "tv" },
  { icon: Wifi, label: "Networking & IT", value: "networking" },
]

const supportOptions = [
  { label: "In-Store Service", value: "in-store" },
  { label: "Home Visit", value: "home" },
  { label: "Remote Support", value: "remote" },
]

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    supportType: "",
    deviceModel: "",
    problem: "",
    urgent: false,
  })

  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert images to base64 for email
      const imageAttachments = await Promise.all(
        uploadedImages.map(async (file, index) => {
          return new Promise<{ filename: string; content: string; contentType: string }>((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const base64Content = (e.target?.result as string).split(',')[1]
              resolve({
                filename: `contact_image_${index + 1}.${file.name.split('.').pop()}`,
                content: base64Content,
                contentType: file.type
              })
            }
            reader.readAsDataURL(file)
          })
        })
      )

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact",
          ...formData,
          attachments: imageAttachments,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          supportType: "",
          deviceModel: "",
          problem: "",
          urgent: false,
        })
        setUploadedImages([])
        setImagePreviewUrls([])
        setTimeout(() => setIsSubmitted(false), 5000)
      } else {
        alert("Failed to submit form. Please try again.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const newImages = files.slice(0, 5 - uploadedImages.length) // Max 5 images
      setUploadedImages(prev => [...prev, ...newImages])
      
      // Create preview URLs
      newImages.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviewUrls(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const triggerFileInput = () => {
    if (fileInputRef.current && uploadedImages.length < 5) {
      fileInputRef.current.click()
    }
  }

  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-gray-300 text-gray-600">
            Get In Touch
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-serif font-light text-gray-900 mb-6 tracking-tight">
            Ready to Fix Your Tech?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Submit a repair request, ask a question, or schedule a consultation. We're here to help with all your
            technology needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="space-y-8">
            <h3 className="text-2xl font-serif font-medium text-gray-900 mb-8">Contact Information</h3>

            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 bg-white border-0 shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{info.label}</h4>
                    <p className="text-lg font-medium text-blue-600 mb-1">{info.value}</p>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-0 overflow-hidden border-0 shadow-lg">
              <div className="p-6 bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-2">Visit Our Location</h4>
                <p className="text-sm text-gray-600">163 Adriaan Ave, Mossel Bay 6500</p>
              </div>
              <div className="h-64 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.8!2d22.1461!3d-34.1836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e2a8b5c8b5c8b5c%3A0x1e2a8b5c8b5c8b5c!2s163%20Adriaan%20Ave%2C%20Mossel%20Bay%2C%206500%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1692000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MARCLINK TECHNOLOGIES Location"
                />
              </div>
            </Card>

            <Card className="p-8 bg-blue-600 text-white border-0 shadow-lg">
              <h4 className="font-serif font-medium text-xl mb-6">Need Immediate Help?</h4>
              <div className="space-y-4">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white text-blue-600 hover:bg-gray-100 rounded-full py-3"
                  onClick={() => window.open("tel:0796644820")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now: 0796644820
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-white text-white hover:bg-white hover:text-blue-600 rounded-full py-3"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-12 bg-white border-0 shadow-lg">
              <h3 className="text-2xl font-serif font-medium text-gray-900 mb-8">Submit Repair Request</h3>

              {isSubmitted ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h4 className="text-xl font-medium text-gray-900 mb-3">Request Submitted!</h4>
                  <p className="text-gray-600">
                    We'll contact you within 2 hours with a price estimate and next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        className="rounded-xl border-gray-200 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">Phone Number *</label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Your phone number"
                        className="rounded-xl border-gray-200 py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Email Address</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="rounded-xl border-gray-200 py-3"
                    />
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-4">Service Type *</label>
                    <div className="grid grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() => handleInputChange("serviceType", service.value)}
                          className={`p-4 rounded-2xl border-2 transition-all flex items-center space-x-3 ${
                            formData.serviceType === service.value
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <service.icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{service.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Support Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-4">Preferred Support Type *</label>
                    <div className="grid grid-cols-3 gap-4">
                      {supportOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange("supportType", option.value)}
                          className={`p-4 rounded-2xl border-2 transition-all text-center ${
                            formData.supportType === option.value
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Device Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Device Model</label>
                    <Input
                      value={formData.deviceModel}
                      onChange={(e) => handleInputChange("deviceModel", e.target.value)}
                      placeholder="e.g., iPhone 14, Samsung Galaxy S23, Dell XPS 13"
                      className="rounded-xl border-gray-200 py-3"
                    />
                  </div>

                  {/* Problem Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">Problem Description *</label>
                    <Textarea
                      required
                      value={formData.problem}
                      onChange={(e) => handleInputChange("problem", e.target.value)}
                      placeholder="Describe the issue you're experiencing..."
                      rows={4}
                      className="rounded-xl border-gray-200"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Upload Photos (Optional) - Max 5 images
                    </label>
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    
                    {/* Upload button */}
                    <div 
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    >
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        {uploadedImages.length === 0 
                          ? "Click to upload photos of the issue or drag and drop" 
                          : `Uploaded ${uploadedImages.length}/5 images`
                        }
                      </p>
                      {uploadedImages.length < 5 && (
                        <p className="text-xs text-gray-500 mt-2">Click to add more photos</p>
                      )}
                    </div>

                    {/* Image previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-3">Uploaded Photos:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Urgent Checkbox */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={formData.urgent}
                      onChange={(e) => handleInputChange("urgent", e.target.checked)}
                      className="rounded border-gray-300 w-4 h-4"
                    />
                    <label htmlFor="urgent" className="text-sm text-gray-900">
                      This is urgent (we'll prioritize your request)
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-full py-4 text-base font-medium"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Repair Request"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our terms of service. We'll contact you within 2 hours with a
                    price estimate.
                  </p>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
