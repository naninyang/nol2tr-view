import { NextApiRequest, NextApiResponse } from 'next';

interface PostData {
  jejeupVideo: string;
  site: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { jejeupVideo } = req.body as PostData;

    try {
      const response = await fetch(`${process.env.STRAPI_URL}/api/unpublish-jejeups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            videoId: jejeupVideo,
            site: 'nol2tr',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const unpublishResponse = await response.json();
      res.status(200).json(unpublishResponse);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
