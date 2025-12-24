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
 * NON-BLOCKING: booking must succeed even if email fails
 */
export async function sendBookingEmails({ name, email, phone, slot }) {
  console.log("📧 Attempting to send booking emails (Nodemailer)...");

  try {
    // ---- Time formatting helper ----
    const formatTime = (timeStr) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
    };

    const formattedDate = new Date(slot.date).toDateString();
    const formattedStart = formatTime(slot.start);
    const formattedEnd = formatTime(slot.end);

    // ---- Student email ----
    const studentMail = {
      from: `"BOLO ACADEMY" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Trial Class Booking is Confirmed 🎉",
      html: `
        <p>Hello <b>${name}</b>,</p>

        <p>Your free trial class has been successfully booked.</p>

        <p>
          <b>Date:</b> ${formattedDate}<br/>
          <b>Time:</b> ${formattedStart} - ${formattedEnd}
        </p>

        <p>We will contact you shortly with joining details.</p>

        <br/>
        <p>- BOLO ACADEMY</p>
      `,
    };

    // ---- Admin email ----
    const adminMail = {
      from: `"BOLO ACADEMY" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Trial Booking",
      html: `
        <h3>New Trial Booking Received</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p>
          <b>Date:</b> ${formattedDate}<br/>
          <b>Time:</b> ${formattedStart} - ${formattedEnd}
        </p>
      `,
    };

    await transporter.sendMail(studentMail);
    await transporter.sendMail(adminMail);

    console.log(" Booking emails sent successfully (Nodemailer)");
  } catch (error) {
    console.error(" Email failed (ignored):", error.message);
    //  VERY IMPORTANT:
    // DO NOT throw
    // Booking must NOT fail due to email issues
  }
}


// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// /**
//  * Send booking emails
//  * - Uses SAME time formatting logic as before
//  * - Non-blocking (email failure will NOT break booking)
//  */
// export async function sendBookingEmails({ name, email, phone, slot }) {
//   console.log("📧 Sending booking emails (Resend)...");

//   try {
//     // ---- Time formatting helper (UNCHANGED LOGIC) ----
//     const formatTime = (timeStr) => {
//       const [hour, minute] = timeStr.split(":").map(Number);
//       const period = hour >= 12 ? "PM" : "AM";
//       const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//       return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
//     };

//     const formattedDate = new Date(slot.date).toDateString();
//     const formattedStart = formatTime(slot.start);
//     const formattedEnd = formatTime(slot.end);

//     // ---- Student email ----
//     await resend.emails.send({
//       from: "Bolo Academy <onboarding@resend.dev>",
//       to: email,
//       subject: "Your Trial Class Booking is Confirmed 🎉",
//       html: `
//         <p>Hello ${name},</p>

//         <p>Your free trial class has been successfully booked.</p>

//         <p>
//           <b>Slot:</b><br/>
//           Date: ${formattedDate}<br/>
//           Time: ${formattedStart} - ${formattedEnd}
//         </p>

//         <p>Thanks a lot for your precious commitment.</p>
//         <p>We will contact you shortly.</p>

//         <br/>
//         <p>- BOLO ACADEMY</p>
//       `,
//     });

//     // ---- Admin email (optional but preserved) ----
//     if (process.env.ADMIN_EMAIL) {
//       await resend.emails.send({
//         from: "Bolo Academy <onboarding@resend.dev>",
//         to: process.env.ADMIN_EMAIL,
//         subject: "New Trial Booking",
//         html: `
//           <h3>New Trial Booking Received</h3>
//           <p><b>Name:</b> ${name}</p>
//           <p><b>Email:</b> ${email}</p>
//           <p><b>Phone:</b> ${phone}</p>
//           <p>
//             <b>Slot:</b><br/>
//             Date: ${formattedDate}<br/>
//             Time: ${formattedStart} - ${formattedEnd}
//           </p>
//         `,
//       });
//     }

//     console.log(" Booking emails sent successfully");
//   } catch (error) {
//     console.error(" Email failed (ignored):", error.message);
//     //  DO NOT throw
//     // Booking must succeed even if email fails
//   }
// }
























