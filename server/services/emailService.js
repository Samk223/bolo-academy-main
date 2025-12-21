import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send booking emails
 */
export async function sendBookingEmails({ name, email, phone, slot }) {
  // Email to student
  console.log("📧 Sending booking emails...");

  const studentMail = {
    from: `"Vintage English Academy" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Trial Class Booking is Confirmed 🎉",
    html: `
      <h3>Hello ${name},</h3>
      <p>Your trial class has been successfully booked.</p>
      <p><b>Slot:</b> ${slot}</p>
      <p>We’ll contact you shortly.</p>
      <br/>
      <p>– Vintage English Academy</p>
    `,
  };

  // Email to admin
  const adminMail = {
    from: `"Vintage English Academy" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "📌 New Trial Booking",
    html: `
      <h3>New Booking Received</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Slot:</b> ${slot}</p>
    `,
  };

  await transporter.sendMail(studentMail);
  await transporter.sendMail(adminMail);
}
