const accountSid = "ACebc7debafbd2c97f2c2f8a4d6a8bafdd"
const authToken = "4c9aae9accf665ce77da9ef395596c9c"
const client = require("twilio")(accountSid, authToken)

export default function handler(req, res) {
  const { body, to, from } = req.body
  
  client.messages
    .create({
      body: body,
      messagingServiceSid: "MGc9b5240988953b6243a12f86ee01e390",
      to: `+61 ${to}`,
    })
    .then((message) => {})
  return res.status(200).json({ message: "success" })
}



