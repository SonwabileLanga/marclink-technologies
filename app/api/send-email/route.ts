import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend (more reliable than SMTP)
const resend = new Resend('re_Qh7XM1dz_Q1S2duxoytb5Nct7JbqUgaTt')

// Fallback to Nodemailer for SMTP if Resend is not configured
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, attachments, ...formData } = body

    let subject = ""
    let htmlContent = ""
    const recipientEmail = "safariemanuel60@gmail.com" // Admin email for all form submissions
    const fromEmail = "onboarding@resend.dev"

    if (type === "contact") {
      subject = `🔧 New Contact Form - ${formData.name}`
      
      const photoSection =
        attachments && attachments.length > 0
          ? `
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
          <h3 style="color: #1e293b; margin-top: 0;">📸 Issue Photos (${attachments.length} attached)</h3>
          <p style="color: #6b7280;">Customer has provided ${attachments.length} photo${attachments.length > 1 ? "s" : ""} of the issue. Check email attachments for images.</p>
        </div>
      `
          : ""

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">MARCLINK TECHNOLOGIES</h1>
            <p style="margin: 5px 0 0 0;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 20px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="color: #1e293b; margin-top: 0;">Customer Information</h3>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>
              <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email || "Not provided"}</a></p>
            </div>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="color: #1e293b; margin-top: 0;">Service Details</h3>
              <p><strong>Service Type:</strong> ${formData.serviceType}</p>
              <p><strong>Support Type:</strong> ${formData.supportType}</p>
              <p><strong>Device Model:</strong> ${formData.deviceModel || "Not specified"}</p>
              <p><strong>Urgent:</strong> ${formData.urgent ? "🚨 YES - Priority Request" : "No"}</p>
            </div>

            ${photoSection}

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #1e293b; margin-top: 0;">Problem Description</h3>
              <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">${formData.problem}</p>
            </div>

            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #059669; font-weight: bold;">
                📞 Action Required: Contact customer within 2 hours with price estimate
              </p>
            </div>
          </div>
        </div>
      `
    } else if (type === "repair") {
      subject = `🔧 New Repair Ticket #${formData.ticketId} - ${formData.customerName}`

      const photoSection =
        attachments && attachments.length > 0
          ? `
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
          <h3 style="color: #1e293b; margin-top: 0;">📸 Device Photos (${attachments.length} attached)</h3>
          <p style="color: #6b7280;">Customer has provided ${attachments.length} photo${attachments.length > 1 ? "s" : ""} of the device. Check email attachments for images.</p>
        </div>
      `
          : ""

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">MARCLINK TECHNOLOGIES</h1>
            <p style="margin: 5px 0 0 0;">Repair Form Submission</p>
          </div>
          
          <div style="padding: 20px;">
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #dc2626;">
              <h2 style="color: #dc2626; margin: 0;">Ticket #${formData.ticketId}</h2>
              <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${formData.date}</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="color: #1e293b; margin-top: 0;">👤 Customer Information</h3>
              <p><strong>Name:</strong> ${formData.customerName}</p>
              <p><strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>
            </div>

            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
              <h3 style="color: #1e293b; margin-top: 0;">📱 Device Information</h3>
              <p><strong>Model:</strong> ${formData.model}</p>
              <p><strong>IMEI:</strong> ${formData.imei || "Not provided"}</p>
            </div>

            <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #1e293b; margin-top: 0;">🔍 Device Condition Check</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <p><strong>Battery:</strong> ${formData.battery === "YES" ? "✅ Present" : formData.battery === "NO" ? "❌ Missing" : "❓ Not specified"}</p>
                <p><strong>SIM:</strong> ${formData.sim === "YES" ? "✅ Present" : formData.sim === "NO" ? "❌ Missing" : "❓ Not specified"}</p>
                <p><strong>Memory Card:</strong> ${formData.memoryCard === "YES" ? "✅ Present" : formData.memoryCard === "NO" ? "❌ Missing" : "❓ Not specified"}</p>
                <p><strong>Back Cover:</strong> ${formData.backCover === "YES" ? "✅ Present" : formData.backCover === "NO" ? "❌ Missing" : "❓ Not specified"}</p>
              </div>
            </div>

            ${photoSection}

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <h3 style="color: #1e293b; margin-top: 0;">🔧 Repair Details</h3>
              <p><strong>Condition:</strong></p>
              <p style="background: white; padding: 10px; border-radius: 4px;">${formData.condition}</p>
              
              <p><strong>Nature of Fault:</strong></p>
              <p style="background: white; padding: 10px; border-radius: 4px;">${formData.natureOfFault}</p>
              
              <p><strong>Terms/Fix/Quotation:</strong></p>
              <p style="background: white; padding: 10px; border-radius: 4px;">${formData.terms}</p>
            </div>

            <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #1e293b; margin-top: 0;">💰 Payment Information</h3>
              <p><strong>Paid:</strong> ${formData.paid}</p>
              <p><strong>Balance:</strong> ${formData.balance}</p>
              <p><strong>Customer Signature:</strong> ${formData.customerSignature}</p>
            </div>

            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px solid #dc2626;">
              <p style="margin: 0; color: #dc2626; font-weight: bold; text-align: center;">
                ⚠️ IMPORTANT TERMS ⚠️<br>
                Customer has agreed to terms and conditions.<br>
                Repairs not claimed within 30 days will be sold to defray expenses.
              </p>
            </div>
          </div>
        </div>
      `
    }

    const resendAttachments = attachments
      ? attachments.map((attachment: any) => ({
          filename: attachment.filename,
          content: attachment.content,
        }))
      : []

    // Try Resend first (more reliable)
    if (true) { // Always use Resend since we have the API key
      try {
        const emailData: any = {
          from: fromEmail,
          to: recipientEmail,
          subject: subject,
          html: htmlContent,
        }

        if (resendAttachments.length > 0) {
          emailData.attachments = resendAttachments
        }

        const result = await resend.emails.send(emailData)

        console.log("Resend success:", result) // Added logging for debugging

        return NextResponse.json({
          success: true,
          message: "Email sent successfully via Resend",
          emailId: result.data?.id,
          attachmentCount: resendAttachments.length,
        })
      } catch (resendError) {
        console.error("Resend failed:", resendError) // Better error logging

        return NextResponse.json(
          {
            success: false,
            message: `Resend failed: ${resendError instanceof Error ? resendError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
      }
    }

    // Fallback to SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailerAttachments = attachments
        ? attachments.map((attachment: any) => ({
            filename: attachment.filename,
            content: attachment.content,
            encoding: "base64",
            contentType: attachment.contentType,
          }))
        : []

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
        attachments: nodemailerAttachments,
      })

      return NextResponse.json({
        success: true,
        message: "Email sent successfully via SMTP",
        attachmentCount: nodemailerAttachments.length,
      })
    }

    // No email service configured
    return NextResponse.json(
      {
        success: false,
        message: "No email service configured. Please set up RESEND_API_KEY or SMTP credentials.",
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Email sending failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
        error: error instanceof Error ? error.stack : "Unknown error",
      },
      { status: 500 },
    )
  }
}
