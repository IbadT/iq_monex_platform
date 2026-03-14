// const nodemailer = require("nodemailer");
// const { MailtrapTransport } = require("mailtrap");

// const TOKEN = "fb78c6883c39db6735438656e8a631b5";

// const transport = nodemailer.createTransport(
//   MailtrapTransport({
//     token: TOKEN,
//   })
// );

// const sender = {
//   address: "hello@demomailtrap.co",
//   name: "Mailtrap Test",
// };
// const recipients = [
//   "ibadtoff@gmail.com",
// ];

// transport
//   .sendMail({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     html: "<b>Congrats for sending test email with Mailtrap!</b>",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);
