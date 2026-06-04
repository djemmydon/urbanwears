import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const { error: dbError } = await supabase
        .from("newsletter_subscribers")
        .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: "email" });

    if (dbError) {
        console.error("Newsletter DB error:", dbError.message);
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"URBANBLAQ" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
                to: email,
                subject: "Welcome to URBANBLAQ — You're on the list!",
                html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#0c1524;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c1524;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111827;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 0;text-align:center;">
              <p style="margin:0 0 24px;font-size:10px;letter-spacing:6px;text-transform:uppercase;color:#ff8c00;font-weight:600;">
                URBANBLAQ
              </p>
              <h1 style="margin:0 0 12px;font-size:36px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:-0.5px;line-height:1.1;">
                You're in the squad.
              </h1>
              <p style="margin:0 0 32px;font-size:15px;color:#9ca3af;line-height:1.6;max-width:400px;margin-left:auto;margin-right:auto;">
                Welcome to URBANBLAQ. You'll be first to know about new drops, exclusive offers, and style updates — straight to your inbox.
              </p>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <a href="https://urbanblaqluxury.com/shop"
                 style="display:inline-block;background:#ff8c00;color:#000000;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:100px;">
                Shop New Arrivals →
              </a>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#1f2937;"></div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#4b5563;line-height:1.6;">
                You're receiving this because you subscribed at urbanblaqluxury.com.<br/>
                No spam — ever. <a href="#" style="color:#6b7280;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
                `,
            });
        } catch (err) {
            console.error("Newsletter email error:", err);
        }
    }

    return NextResponse.json({ success: true });
}
