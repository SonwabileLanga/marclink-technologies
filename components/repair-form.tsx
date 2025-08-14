"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Printer, Download, ArrowLeft, CheckCircle, AlertCircle, Upload, X, Camera } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function RepairForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    date: new Date().toISOString().split("T")[0],
    telephone: "",
    model: "",
    imeiNo: "",
    battery: null as boolean | null,
    sim: null as boolean | null,
    memoryCard: null as boolean | null,
    backCover: null as boolean | null,
    paid: "",
    balance: "",
    condition: "",
    natureOfFault: "",
    termFixQuotation: "",
    customerSignature: "",
  })

  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [formNumber] = useState(Math.floor(Math.random() * 1000) + 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
    ticketId?: string
  }>({ type: null, message: "" })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCheckboxChange = (field: string, value: boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files).slice(0, 5 - uploadedImages.length) // Max 5 images
    const validFiles = newFiles.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB max
      return isValidType && isValidSize
    })

    if (validFiles.length > 0) {
      setUploadedImages((prev) => [...prev, ...validFiles])

      // Create preview URLs
      validFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            setImagePreviewUrls((prev) => [...prev, e.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }

    // Reset input
    event.target.value = ""
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      // Validate required fields
      if (!formData.customerName || !formData.telephone || !formData.model || !formData.natureOfFault) {
        setSubmitStatus({
          type: "error",
          message: "Please fill in all required fields: Customer Name, Telephone, Model, and Nature of Fault",
        })
        setIsSubmitting(false)
        return
      }

      const ticketId = `MRC-${Date.now()}-${Math.floor(Math.random() * 1000)}`

      // Convert images to base64 for email attachment
      const imageAttachments = await Promise.all(
        uploadedImages.map(async (file, index) => {
          return new Promise<{ filename: string; content: string; contentType: string }>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => {
              const base64 = (reader.result as string).split(",")[1]
              resolve({
                filename: `device-image-${index + 1}.${file.name.split(".").pop()}`,
                content: base64,
                contentType: file.type,
              })
            }
            reader.readAsDataURL(file)
          })
        }),
      )

      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "repair",
          ticketId,
          date: formData.date,
          customerName: formData.customerName,
          phone: formData.telephone,
          model: formData.model,
          imei: formData.imeiNo,
          battery: formData.battery === true ? "YES" : formData.battery === false ? "NO" : "Not specified",
          sim: formData.sim === true ? "YES" : formData.sim === false ? "NO" : "Not specified",
          memoryCard: formData.memoryCard === true ? "YES" : formData.memoryCard === false ? "NO" : "Not specified",
          backCover: formData.backCover === true ? "YES" : formData.backCover === false ? "NO" : "Not specified",
          paid: formData.paid || "Not specified",
          balance: formData.balance || "Not specified",
          condition: formData.condition || "Not specified",
          natureOfFault: formData.natureOfFault,
          terms: formData.termFixQuotation || "Not specified",
          customerSignature: formData.customerSignature || "Not provided",
          attachments: imageAttachments,
        }),
      })

      if (emailResponse.ok) {
        setSubmitStatus({
          type: "success",
          message: `Form submitted successfully! Your repair ticket ID is: ${ticketId}`,
          ticketId: ticketId,
        })

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            customerName: "",
            date: new Date().toISOString().split("T")[0],
            telephone: "",
            model: "",
            imeiNo: "",
            battery: null,
            sim: null,
            memoryCard: null,
            backCover: null,
            paid: "",
            balance: "",
            condition: "",
            natureOfFault: "",
            termFixQuotation: "",
            customerSignature: "",
          })
          setUploadedImages([])
          setImagePreviewUrls([])
          setSubmitStatus({ type: null, message: "" })
        }, 5000)
      } else {
        setSubmitStatus({
          type: "error",
          message: "Failed to submit form. Please try again.",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const printContent = document.querySelector(".repair-form-content")?.innerHTML
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Repair Form ${formNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .border-2 { border: 2px solid #000; }
                .p-4 { padding: 16px; }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                .text-red-600 { color: #dc2626; }
                .border-dotted { border-bottom: 2px dotted #666; }
                .grid { display: grid; }
                .space-y-4 > * + * { margin-top: 16px; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current && uploadedImages.length < 5) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-accent transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Website</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handlePrint} className="flex items-center space-x-2 bg-transparent">
            <Printer className="w-4 h-4" />
            <span>Print Form</span>
          </Button>
          <Button onClick={handleDownload} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center space-x-3 print:hidden ${
            submitStatus.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {submitStatus.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <div>
            <p className="font-semibold">{submitStatus.message}</p>
            {submitStatus.ticketId && <p className="text-sm mt-1">Please save this ticket ID for your records.</p>}
          </div>
        </div>
      )}

      {/* Repair Form */}
      <Card className="p-8 bg-white shadow-lg repair-form-content">
        {/* Form Header */}
        <div className="border-2 border-gray-800 p-4 mb-8">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-red-600 mb-2">MARCLINK TECHNOLOGIES</h1>
            <h2 className="text-lg font-semibold text-gray-800">CELL & COMPUTER REPAIRS</h2>
            <div className="text-xl font-bold text-gray-800 mt-2">079 664 4820</div>
          </div>

          <div className="text-center text-sm text-gray-700">
            <div>Mossel Bay, Western Cape 6500</div>
            <div>info@marclink.co.za</div>
          </div>

          {/* Form Number */}
          <div className="absolute top-4 right-4 text-2xl font-bold text-red-500 print:block hidden">{formNumber}</div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-semibold min-w-[80px]">
                MR/MRS: <span className="text-red-500">*</span>
              </label>
              <div className="flex-1 border-b-2 border-dotted border-gray-400">
                <Input
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="border-none shadow-none p-0 focus-visible:ring-0"
                  placeholder="Customer Name (Required)"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-8">
              <div className="flex-1 border-b-2 border-dotted border-gray-400">
                <Input
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                  className="border-none shadow-none p-0 focus-visible:ring-0"
                  placeholder="Additional Info"
                />
              </div>
              <label className="font-semibold min-w-[40px]">
                TEL: <span className="text-red-500">*</span>
              </label>
              <div className="flex-1 border-b-2 border-dotted border-gray-400">
                <Input
                  value={formData.telephone}
                  onChange={(e) => handleInputChange("telephone", e.target.value)}
                  className="border-none shadow-none p-0 focus-visible:ring-0"
                  placeholder="Phone Number (Required)"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <label className="font-semibold">DATE:</label>
              <div className="border-b-2 border-dotted border-gray-400">
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="border-none shadow-none p-0 focus-visible:ring-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center space-x-4">
            <label className="font-semibold min-w-[60px]">
              Model: <span className="text-red-500">*</span>
            </label>
            <div className="flex-1 border-b-2 border-dotted border-gray-400">
              <Input
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="border-none shadow-none p-0 focus-visible:ring-0"
                placeholder="Device Model (Required)"
                required
              />
            </div>
            <div className="text-3xl font-bold text-red-500 ml-8">{formNumber}</div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="font-semibold min-w-[80px]">IMEI NO:</label>
            <div className="flex-1 border-b-2 border-dotted border-gray-400">
              <Input
                value={formData.imeiNo}
                onChange={(e) => handleInputChange("imeiNo", e.target.value)}
                className="border-none shadow-none p-0 focus-visible:ring-0"
                placeholder="IMEI Number"
              />
            </div>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            {[
              { label: "BATTERY", field: "battery" },
              { label: "SIM:", field: "sim" },
              { label: "M/CARD", field: "memoryCard" },
              { label: "BACK COVER", field: "backCover" },
            ].map((item) => (
              <div key={item.field} className="flex items-center space-x-8">
                <label className="font-semibold min-w-[100px]">{item.label}</label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">YES</span>
                    <div className="w-6 h-6 border-2 border-gray-800 flex items-center justify-center">
                      <Checkbox
                        checked={formData[item.field as keyof typeof formData] === true}
                        onCheckedChange={() => handleCheckboxChange(item.field, true)}
                        className="border-none shadow-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">NO</span>
                    <div className="w-6 h-6 border-2 border-gray-800 flex items-center justify-center">
                      <Checkbox
                        checked={formData[item.field as keyof typeof formData] === false}
                        onCheckedChange={() => handleCheckboxChange(item.field, false)}
                        className="border-none shadow-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="font-semibold min-w-[60px]">PAID</label>
              <div className="border-b-2 border-dotted border-gray-400 flex-1">
                <Input
                  value={formData.paid}
                  onChange={(e) => handleInputChange("paid", e.target.value)}
                  className="border-none shadow-none p-0 focus-visible:ring-0"
                  placeholder="R"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="font-semibold min-w-[80px]">BALANCE</label>
              <div className="border-b-2 border-dotted border-gray-400 flex-1">
                <Input
                  value={formData.balance}
                  onChange={(e) => handleInputChange("balance", e.target.value)}
                  className="border-none shadow-none p-0 focus-visible:ring-0"
                  placeholder="R"
                />
              </div>
            </div>

            {/* Warning Box */}
            <div className="border-2 border-red-500 p-3 bg-red-50">
              <div className="text-center text-red-600 font-semibold text-sm">
                <div className="mb-1">Please Note:</div>
                <div>We will NOT be responsible</div>
                <div>for ANY Sim or Mem Cards</div>
                <div className="font-bold">PLEASE REMOVE NOW</div>
              </div>
            </div>
          </div>
        </div>

        {/* Condition and Fault Sections */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="font-semibold block mb-2">CONDITION:</label>
            <div className="border-b-2 border-dotted border-gray-400">
              <Textarea
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className="border-none shadow-none resize-none focus-visible:ring-0"
                rows={2}
                placeholder="Describe the current condition of the device"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-2">
              NATURE OF FAULT: <span className="text-red-500">*</span>
            </label>
            <div className="border-b-2 border-dotted border-gray-400">
              <Textarea
                value={formData.natureOfFault}
                onChange={(e) => handleInputChange("natureOfFault", e.target.value)}
                className="border-none shadow-none resize-none focus-visible:ring-0"
                rows={2}
                placeholder="Describe the problem or issue (Required)"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-2">TERM, FIX, QUOTATION, OTHER:</label>
            <div className="border-b-2 border-dotted border-gray-400">
              <Textarea
                value={formData.termFixQuotation}
                onChange={(e) => handleInputChange("termFixQuotation", e.target.value)}
                className="border-none shadow-none resize-none focus-visible:ring-0"
                rows={2}
                placeholder="Terms, fix details, quotation, or other notes"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="space-y-6 mb-8 print:hidden">
          <div>
            <label className="font-semibold block mb-4 flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Device Photos (Optional - Max 5 images, 5MB each)</span>
            </label>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadedImages.length >= 5}
              />

              <div
                className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary hover:bg-gray-50 transition-all cursor-pointer ${
                  uploadedImages.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={triggerFileInput}
              >
                <div className="flex flex-col items-center space-y-3">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div className="text-lg font-medium text-gray-700">
                    {uploadedImages.length >= 5 ? "Maximum 5 images reached" : "Click here to upload device photos"}
                  </div>
                  <div className="text-sm text-gray-500">Or drag and drop your images here</div>
                  <div className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB each</div>
                </div>
              </div>

              {/* Alternative button approach */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={uploadedImages.length >= 5}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Files</span>
                </Button>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Device image ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{uploadedImages[index]?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4 mb-8">
          <div>
            <span className="font-semibold">CONDITIONS:</span>
            <span className="text-red-600 font-semibold ml-4">
              REPAIRS NOT CLAIMED WITHIN 30 DAYS TO BE SOLD TO DEFRAY EXPENSES.
            </span>
            <span className="ml-2">NOT RESPONSIBLE FOR BURGLARIES, FIRE LOSS</span>
          </div>

          <div>
            <span className="font-semibold">PLEASE NOTE:</span>
            <span className="ml-4">
              NO GUARANTEE ON WATER DAMAGE PHONES AND ALL TYPES OF L.C.D. ALL OTHER REPAIRS DONE BY US WILL BE
              GUARANTEED FOR THIRTY (30) DAYS ONLY. NO GUARANTEE ON ALL SOFTWARE. CONTACT SERVICE PHONES & BROKEN PHONES
              DUE TO NEGLIGENCE.
            </span>
          </div>
        </div>

        {/* Customer Signature */}
        <div className="border-t-2 border-gray-300 pt-6">
          <div className="flex items-center space-x-4">
            <label className="font-semibold">CUSTOMER SIGNATURE:</label>
            <div className="flex-1 border-b-2 border-dotted border-gray-400">
              <Input
                value={formData.customerSignature}
                onChange={(e) => handleInputChange("customerSignature", e.target.value)}
                className="border-none shadow-none p-0 focus-visible:ring-0"
                placeholder="Digital signature or name"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center print:hidden">
          <Button
            size="lg"
            className="bg-primary hover:bg-accent transition-colors px-12"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Repair Form"}
          </Button>
          <p className="text-sm text-gray-600 mt-2">* Required fields must be completed</p>
          {uploadedImages.length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              {uploadedImages.length} image{uploadedImages.length > 1 ? "s" : ""} will be attached
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
