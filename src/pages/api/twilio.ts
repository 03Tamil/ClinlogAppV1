const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const client = require("twilio")(accountSid, authToken);

export default function handler(req, res) {
  const { body, to, from } = req.body;

  client.messages
    .create({
      body: body,
      messagingServiceSid: "MGc9b5240988953b6243a12f86ee01e390",
      to: `+61 ${to}`,
    })
    .then((message) => {});
  return res.status(200).json({ message: "success" });
}
