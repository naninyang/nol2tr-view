import type { NextApiRequest, NextApiResponse } from 'next';
import { getMusicsData } from '@/utils/strapi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const musicId = req.query.musicId as string;

  if (!musicId) {
    try {
      const data = await getMusicsData();
      res.status(200).json(data);
    } catch (error) {
      console.log('Unsupported method');
    }
  } else {
    try {
      const response = await fetch(`${process.env.STRAPI_URL}/api/musics-nol2trs/${musicId}`, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch article data');
      }
      const musicData = await response.json();
      res.status(200).json(musicData);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
