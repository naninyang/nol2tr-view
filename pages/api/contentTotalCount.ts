import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const interviewUrl = `${process.env.STRAPI_URL}/api/interview-nol2trs`;
    const interviewResponse = await fetch(interviewUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    });
    const interviewData = await interviewResponse.json();

    const interviewCount = interviewData.meta.pagination.total;

    const newsicUrl = `${process.env.STRAPI_URL}/api/newsic-nol2trs`;
    const newsicResponse = await fetch(newsicUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    });
    const newsicData = await newsicResponse.json();

    const newsicCount = newsicData.meta.pagination.total;

    res.status(200).send({ musics: interviewCount + newsicCount, interview: interviewCount, newsic: newsicCount });
  } else {
    console.log('Unsupported method');
  }
}
