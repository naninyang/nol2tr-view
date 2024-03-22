import type { NextApiRequest, NextApiResponse } from 'next';
import { getInterviewData } from '@/utils/strapi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = Number(req.query.page) || 1;
    const data = await getInterviewData(page);
    res.status(200).json(data);
  } else {
    console.log('Unsupported method');
  }
}
