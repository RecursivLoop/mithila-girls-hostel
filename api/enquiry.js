import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "mriganksmishra@gmail.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, email, room_type, message } = req.body || {};

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Please tell us your name." });
  }
  if (!phone || !/^[0-9+\s]{7,15}$/.test(phone)) {
    return res.status(400).json({ error: "Please provide a valid phone number." });
  }
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email or leave it blank." });
  }
  if (message && message.length > 2000) {
    return res.status(400).json({ error: "Message too long." });
  }

  const clean = {
    name: name.trim().slice(0, 120),
    phone: phone.trim().slice(0, 20),
    email: (email || "").trim().slice(0, 200) || null,
    room_type: ["single", "double", "triple", "not-sure"].includes(room_type) ? room_type : "not-sure",
    message: (message || "").trim().slice(0, 2000) || null,
    source: "website",
    user_agent: (req.headers["user-agent"] || "").slice(0, 300),
  };

  const { data, error } = await supabase
    .from("enquiries")
    .insert(clean)
    .select()
    .single();

  if (error) {
    console.error("Supabase insert failed:", error);
    return res.status(500).json({ error: "Could not save enquiry. Please WhatsApp us." });
  }

  // Fire-and-forget email — don't fail the whole request if email fails
  if (resend) {
    resend.emails
      .send({
        from: "Mithila Girls Hostel <onboarding@resend.dev>",
        to: NOTIFY_EMAIL,
        subject: `New enquiry: ${clean.name} (${clean.room_type})`,
        text:
          `New enquiry from the website:\n\n` +
          `Name: ${clean.name}\n` +
          `Phone: ${clean.phone}\n` +
          `Email: ${clean.email || "-"}\n` +
          `Room Type: ${clean.room_type}\n` +
          `Message: ${clean.message || "-"}\n\n` +
          `Received: ${new Date().toISOString()}\n` +
          `Enquiry ID: ${data.id}\n`,
      })
      .catch((e) => console.error("Resend failed:", e));
  }

  return res.status(200).json({ ok: true, id: data.id });
}
