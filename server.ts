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
  whatsapp: z.string().min(10, "WhatsApp number is too short"),
  package: z.string(),
  timeline: z.string(),
  seenWork: z.string().optional().default("no")
});

app.post('/api/booking', async (req: any, res: any) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    const { name, whatsapp, package: pkg, timeline, seenWork } = validatedData;

    // Save to Database
    const lead = await prisma.lead.create({
      data: {
        name,
        whatsapp,
        package: pkg,
        timeline,
        seenWork
      } as any,
    });

    // Send Email
    await resend.emails.send({
      from: 'DevClyst <onboarding@resend.dev>',
      to: 'lodhihasnain70@gmail.com',
      subject: `New Lead: ${name} (DevClyst)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #0D9488; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Lead Captured!</h1>
          </div>
          <div style="padding: 30px; color: #1e293b;">
            <p style="font-size: 16px; margin-bottom: 20px;">You have a new consultation request from your funnel.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 180px;">Full Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${name}</td>
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

    res.json({ success: true, lead });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
