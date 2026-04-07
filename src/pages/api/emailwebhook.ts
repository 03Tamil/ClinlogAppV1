// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { decryptId } from "helpersv2/Auth";
import { gql, GraphQLClient } from "graphql-request";

export const config = {
  api: {
    bodyParser: false,
  },
};

type HeaderPair = [string, string];

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0],
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ fields, files });
    });
  });
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseJson<T>(value: string | undefined): T | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function getHeader(headers: HeaderPair[] | undefined, name: string) {
  return headers?.find(
    ([headerName]) => headerName.toLowerCase() === name.toLowerCase(),
  )?.[1];
}

function fromEmailSafeReplyToken(value: string) {
  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedValue = normalizedValue.padEnd(
    Math.ceil(normalizedValue.length / 4) * 4,
    "=",
  );

  return Buffer.from(paddedValue, "base64").toString("utf8");
}

function decryptReplyToken(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return decryptId(fromEmailSafeReplyToken(value)) || null;
  } catch {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fields, files } = await formidablePromise(req, { multiples: true });
    const recipient = firstValue(fields.recipient);
    const sender = firstValue(fields.sender);
    const from = firstValue(fields.from);
    const subject = firstValue(fields.subject);
    const plainText = firstValue(fields["body-plain"]);
    const strippedText = firstValue(fields["stripped-text"]);
    const html = firstValue(fields["body-html"]);
    const strippedHtml = firstValue(fields["stripped-html"]);
    const timestamp = firstValue(fields.timestamp);
    const token = firstValue(fields.token);
    const signature = firstValue(fields.signature);
    const attachmentCount = Number(firstValue(fields["attachment-count"]) || 0);
    const messageHeaders = parseJson<HeaderPair[]>(
      firstValue(fields["message-headers"]),
    );

    const messageId =
      firstValue(fields["Message-Id"]) ??
      getHeader(messageHeaders, "Message-Id");
    const inReplyTo = getHeader(messageHeaders, "In-Reply-To");
    const references = getHeader(messageHeaders, "References");
    const date = getHeader(messageHeaders, "Date");
    const replyTo = getHeader(messageHeaders, "Reply-To");
    const to = getHeader(messageHeaders, "To");
    const cc = getHeader(messageHeaders, "Cc");

    const attachments = Object.values(files).flatMap((value) => {
      const fileList = Array.isArray(value) ? value : value ? [value] : [];

      return fileList.map((file) => ({
        originalFilename: file.originalFilename,
        mimetype: file.mimetype,
        size: file.size,
        filepath: file.filepath,
      }));
    });

    const replyToken = recipient?.split("reply+")[1]?.split("@")[0] || null;
    const decryptedReplyToken = decryptReplyToken(replyToken);
    const [foundLeadId, foundLocationId] = decryptedReplyToken?.split("::") || [
      null,
      null,
    ];

    const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
      headers: {
        Authorization: `${process.env.NEW_LEAD_TOKEN}`,
      },
    });
    const querySingleLead = gql`
      query querySingleLead(
        $recordClinic: [QueryArgument]
        $id: [QueryArgument]
      ) {
        entries(section: "newLeadInfo", recordClinic: $recordClinic, id: $id) {
          ... on newLeadInfo_default_Entry {
            id
            recordFirstName
            recordLastName
            recordMobilePhone
          }
        }
      }
    `;

    const updateLeadMutation = gql`
      mutation updateLeadMutation(
        $id: ID
        $recordFirstName: String
        $recordLastName: String
        $recordEmail: String
        $recordMobilePhone: String
        $recordClinic: [Int]
        $recordEnquiryDate: DateTime
        $recordEnquiryType: String
        $leadType: String
        $submittedFormName: String
        $recordAdditionalNotes: String
        $websiteEnquired: String
        $referer: String
        $leadActionStatus: String
        $recordFollowUpDate: DateTime
        $recordFollowUpNotes: String
        $recordFollowUpStaffMember: [Int]
        $recordLeadStatus: String
        $messagePatientTemplate: String
        $messagePatientMethod: String
        $messagePatientMessage: String
        $userPostcode: String
        $utmSource: String
        $utmMedium: String
        $utmCampaign: String
        $utmAdgroup: String
        $utmTerm: String
      ) {
        save_newLeadInfo_default_Entry(
          id: $id
          authorId: 1
          recordFirstName: $recordFirstName
          recordLastName: $recordLastName
          recordEmail: $recordEmail
          recordMobilePhone: $recordMobilePhone
          recordClinic: $recordClinic
          recordEnquiryDate: $recordEnquiryDate
          recordEnquiryType: $recordEnquiryType
          leadType: $leadType
          leadActionStatus: $leadActionStatus
          submittedFormName: $submittedFormName
          recordAdditionalNotes: $recordAdditionalNotes
          websiteEnquired: $websiteEnquired
          referer: $referer
          recordLeadStatus: $recordLeadStatus
          recordFollowUpDate: $recordFollowUpDate
          recordFollowUpNotes: $recordFollowUpNotes
          recordFollowUpStaffMember: $recordFollowUpStaffMember
          messagePatientTemplate: $messagePatientTemplate
          messagePatientMethod: $messagePatientMethod
          messagePatientMessage: $messagePatientMessage
          userPostcode: $userPostcode
          utmSource: $utmSource
          utmMedium: $utmMedium
          utmCampaign: $utmCampaign
          utmAdgroup: $utmAdgroup
          utmTerm: $utmTerm
        ) {
          id
        }
      }
    `;

    const mailgunReplyEmail = {
      recipient,
      sender,
      from,
      to,
      cc,
      replyTo,
      subject,
      strippedText,
      plainText,
      replyToken,
      decryptedReplyToken,
      foundLeadId,
      foundLocationId,
      // html,
      // strippedHtml,
      // messageId,
      // inReplyTo,
      // references,
      // date,
      // timestamp,
      // token,
      // signature,
      // attachmentCount,
      // attachments,
      // rawFields: fields,
    };

    try {
      const singleLead = await graphQLClient.request(querySingleLead, {
        recordClinic: Number(foundLocationId),
        id: Number(foundLeadId),
      });

      const result = await graphQLClient.request(updateLeadMutation, {
        recordClinic: Number(foundLocationId),
        recordEmail: sender,
        title: `${sender} email lead`,
        recordFirstName: singleLead?.entries[0]?.recordFirstName,
        recordLastName: singleLead?.entries[0]?.recordLastName,
        recordMobilePhone: singleLead?.entries[0]?.recordMobilePhone,
        recordEnquiryDate: new Date(),
        recordAdditionalNotes: strippedText,
        leadType: "email",
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update lead" });
    }
    return res.status(200).json(mailgunReplyEmail);
  } catch (error) {
    return res.status(500).json({ error: "Failed to parse Mailgun webhook" });
  }
}
