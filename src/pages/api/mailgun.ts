import Mailgun from "mailgun.js";
const formData = require("form-data");
const fs = require("fs");
import formidable from "formidable";
import { Writable } from "stream";
import { NextApiRequest } from "next";
import { logger } from "../../utils/logger";
export const config = {
  api: {
    bodyParser: false,
  },
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0],
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(404).end();
  try {
    const { fields, files } = await formidablePromise(req, { multiples: true });
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY.toString(),
    });
    let newFiles;
    if (Array.isArray(files.fileData)) {
      newFiles = [];
      for (let i = 0; i < files.fileData.length; i++) {
        const fullFileData = await fs.createReadStream(
          files.fileData[i].filepath,
        );
        newFiles.push({
          filename: files.fileData[i].originalFilename,
          data: fullFileData,
        });
      }
    } else {
      if (!!files.fileData?.filepath) {
        const fullFileData = await fs.createReadStream(files.fileData.filepath);
        newFiles = {
          filename: files.fileData.originalFilename,
          data: fullFileData,
        };
      }
    }

    const emailToSend = {
      from: "SmileConnect<noreply@smileconnect.com.au>",
      to: fields.email,
      subject: fields.subject,
      attachment: newFiles,
      html: fields?.html,
      text: fields?.text,
    };
    mg.messages
      .create("smileconnect.com.au", emailToSend)
      .then((msg) => {
        if (fields?.initiatorId) {
          logger(
            fields.initiatorId,
            "INFO",
            "sc-mailgun-success",
            `Success - Email sent to ${fields.receiverId}.`,
          );
        }
        return res.status(200).json({ status: "success" });
      }) // logs response data
      .catch((err) => {
        if (fields?.initiatorId) {
          logger(
            fields.initiatorId,
            "ERROR",
            "sc-mailgun-failure",
            `Failure - Email sent to ${fields.receiverId}.`,
          );
        }
        return res.status(500).json({ error: err });
      });
  } catch (err) {
    console.log(err);
    //return res.status(500).json({ error: err })
  }
  //return res.status(200).json({ status: "success" })
}
