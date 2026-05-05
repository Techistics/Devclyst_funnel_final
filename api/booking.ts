import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { z } from 'zod';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

const resend = new Resend(process.env.RESEND_API_KEY);

const bookingSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Please enter a valid email address (e.g. you@gmail.com)"),
  whatsapp: z.string().regex(/^(03\d{9}|923\d{9}|\+923\d{9})$/, "Enter a valid number"),
  package: z.string(),
  timeline: z.string(),
  seenWork: z.string().optional().default("no")
});

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const validatedData = bookingSchema.parse(req.body);
    const { name, email, whatsapp, package: pkg, timeline, seenWork } = validatedData;

    // Save to Database
    const lead = await prisma.lead.create({
      data: { name, email, whatsapp, package: pkg, timeline, seenWork } as any,
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
  <div style="background-color: #0D9488; color: white; padding: 28px 32px; text-align: center;">
    <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 0.1em; opacity: 0.85; text-transform: uppercase;">You're in good hands</p>
    <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Your Spot Is Confirmed.</h1>
  </div>
  <div style="padding: 32px; color: #1e293b;">
    <p style="font-size: 16px; font-weight: 600; margin: 0 0 6px;">Hi ${name.split(' ')[0]},</p>
    <p style="font-size: 15px; color: #475569; line-height: 1.75; margin: 0 0 20px;">
      Welcome to DevClyst. You've just taken the first step toward a website that doesn't just look great — it works as your best salesperson, 24/7.
    </p>
    <p style="font-size: 15px; color: #475569; line-height: 1.75; margin: 0 0 24px;">
      Our team has reviewed your request and will reach out on WhatsApp at <strong style="color: #1e293b;">${whatsapp}</strong> within the next <strong style="color: #1e293b;">24 hours</strong> to lock in your free strategy call.
    </p>
    <div style="background: #f0fdfa; border-left: 3px solid #0D9488; border-radius: 0 8px 8px 0; padding: 18px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 10px; font-weight: 700; color: #0D9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;">Your Booking Summary</p>
      <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><span style="color: #64748b;">Package:</span> &nbsp;${pkg}</p>
      <p style="margin: 4px 0; font-size: 14px; color: #1e293b;"><span style="color: #64748b;">Timeline:</span> &nbsp;${timeline}</p>
    </div>
    <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px;">
      <p style="margin: 0 0 10px; font-weight: 700; font-size: 13px; color: #1e293b;">What happens next?</p>
      <p style="margin: 0 0 8px; font-size: 14px; color: #475569; line-height: 1.6;">1. &nbsp;We'll message you on WhatsApp to confirm a time that works for you.</p>
      <p style="margin: 0 0 8px; font-size: 14px; color: #475569; line-height: 1.6;">2. &nbsp;We'll jump on a free 30-minute strategy call — zero pressure, zero obligation.</p>
      <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">3. &nbsp;You'll walk away with a clear roadmap, whether you work with us or not.</p>
    </div>
    <p style="font-size: 14px; color: #64748b; line-height: 1.7; margin-bottom: 28px;">
      In the meantime, explore what we've built for clients just like you at <a href="https://devclyst.vercel.app/" style="color: #0D9488; font-weight: 600; text-decoration: none;">https://devclyst.vercel.app/</a>.
    </p>
    <div style="text-align: center;">
      <a href="https://wa.me/923704640009" style="display: inline-block; background-color: #0D9488; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px;">Message Us on WhatsApp</a>
      <p style="font-size: 13px; color: #94a3b8; margin: 12px 0 0;">Can't wait? We're just one message away.</p>
    </div>
  </div>
  <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #f1f5f9;">
    <p style="margin: 0; font-size: 12px; color: #94a3b8;">© 2025 DevClyst · <a href="https://devclyst.vercel.app/" style="color: #94a3b8; text-decoration: none;">https://devclyst.vercel.app/</a></p>
  </div>
</div>
      `,
    });

    return res.status(200).json({ success: true, lead });
  } catch (error: any) {
    console.error('API Error:', error);
    if (error instanceof z.ZodError) return res.status(400).json({ success: false, errors: error.issues });
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}