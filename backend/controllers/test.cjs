// const twilio = require("twilio");
// require("dotenv").config();

// const client = new twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// async function sendSMS() {
//   const message = await client.messages.create({
//     body: `Your verification code is: 5555`,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: "+919959728604",
//   });
//   console.log(message);
// }

// sendSMS();

let { msg91 } = require("msg91");
msg91.initialize({ authKey: "442236AzijQ9swB67bc2e7bP1" });

let sms = msg91.getSMS();
sms.send("flowId", { mobile: "+919703588400" });
