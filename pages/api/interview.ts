import type { NextApiRequest, NextApiResponse } from 'next';
import { getInterviewData } from '@/utils/strapi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;

  if (!id) {
    const page = Number(req.query.page) || 1;
    const data = await getInterviewData(page);
    res.status(200).json(data);
  }

  try {
    const response = await fetch(`${process.env.STRAPI_URL}/api/interview-nol2trs/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch article data');
    }
    const articleData = await response.json();
    res.status(200).json(articleData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
