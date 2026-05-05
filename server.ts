import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Zod Schema for Booking Validation
const bookingSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Please enter a valid email address (e.g. you@gmail.com)"),
  whatsapp: z.string().regex(/^(03\d{9}|923\d{9}|\+923\d{9})$/, "Enter a valid number"),
  package: z.string(),
  timeline: z.string(),
  seenWork: z.string().optional().default("no")
});

app.post('/api/booking', async (req: any, res: any) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    const { name, email, whatsapp, package: pkg, timeline, seenWork } = validatedData;

    // Save to Database
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        whatsapp,
        package: pkg,
        timeline,
        seenWork
      } as any,
    });

    // --- Email 1: Admin Notification ---
    await resend.emails.send({
      from: 'DevClyst <noreply@devclyst.tierceledconsulting.com>',
      to: 'lodhihasnain70@gmail.com',
      subject: `🔥 New Lead: ${name} (DevClyst)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0D9488; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚀 New Lead Captured!</h1>
          </div>
          <div style="padding: 30px; color: #1e293b;">
            <p style="font-size: 16px; margin-bottom: 20px;">You have a new consultation request from your funnel.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 180px;">Full Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">WhatsApp</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${whatsapp}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Package</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${pkg}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Timeline</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${timeline}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Seen our work?</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${seenWork.toUpperCase()}</td>
              </tr>
            </table>
            <div style="margin-top: 30px; text-align: center;">
               <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Message on WhatsApp</a>
            </div>
          </div>
        </div>
      `,
    });

    // --- Email 2: Client Confirmation ---
    await resend.emails.send({
      from: 'DevClyst <noreply@devclyst.tierceledconsulting.com>',
      to: email,
      subject: `We've Received Your Booking, ${name.split(' ')[0]}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0D9488; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Booking Received! </h1>
          </div>
          <div style="padding: 32px; color: #1e293b;">
            <p style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">Hi ${name.split(' ')[0]},</p>
            <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
              Thank you for reaching out to <strong>DevClyst</strong>! We've received your free consultation request and our team will get back to you on WhatsApp (<strong>${whatsapp}</strong>) within the next <strong>24 hours</strong>.
            </p>
            <div style="background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-weight: 700; color: #0D9488; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Your Booking Summary</p>
              <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Package:</strong> ${pkg}</p>
              <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><strong>Timeline:</strong> ${timeline}</p>
            </div>
            <p style="font-size: 14px; color: #64748b; line-height: 1.7;">
              In the meantime, feel free to check out our portfolio at <a href="https://devclyst.vercel.app/" style="color: #0D9488; font-weight: 600;">https://devclyst.vercel.app/</a>.
            </p>
            <div style="margin-top: 28px; text-align: center;">
              <a href="https://wa.me/923704640009" style="background-color: #0D9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px;">Message Us on WhatsApp</a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">© 2025 DevClyst · <a href="https://devclyst.vercel.app/" style="color: #94a3b8; text-decoration: none;">https://devclyst.vercel.app/</a></p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, lead });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
