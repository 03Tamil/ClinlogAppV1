export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(404).end();
  if (!req.body) return res.status(200).json({ status: "error" });
  try {
    let data = JSON.parse(req.body);
    let text = data?.text || "No message provided";
    let isToClinic = data?.isToClinic || false;
    const webhookToUse = isToClinic
      ? process.env.SLACK_WEBHOOK_URL
      : process.env.SLACK_PATIENT_WEBHOOK_URL;
    let slackWebhook = await fetch(webhookToUse, {
      method: "POST",
      body: JSON.stringify({ text: text }),
    });
  } catch (error) {
    return res.status(500).json({ status: error });
  }

  res.status(200).json({ status: "success" });
}
