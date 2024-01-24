import { NextApiRequest, NextApiResponse } from 'next';

interface PostData {
  subject: string;
  guestName: string;
  guestEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { subject, guestName, guestEmail, content, createdAt, updatedAt, publishedAt } = req.body as PostData;

    try {
      const response = await fetch(`${process.env.STRAPI_URL}/api/contact-nol2trs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            subject,
            guestName,
            guestEmail,
            content,
            createdAt,
            updatedAt,
            publishedAt,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const contactResponse = await response.json();
      res.status(200).json(contactResponse);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
