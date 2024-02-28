import type { NextApiRequest, NextApiResponse } from 'next';
import { getMusicsData } from '@/utils/strapi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const musicId = req.query.musicId as string;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 100;

  if (!musicId) {
    const data = await getMusicsData(page, pageSize);
    res.status(200).json(data);
  } else {
    try {
      const response = await fetch(`${process.env.STRAPI_URL}/api/musics-nol2trs/${musicId}`, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch music data');
      }
      const musicData = await response.json();
      res.status(200).json(musicData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
