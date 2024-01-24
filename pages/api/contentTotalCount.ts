import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const ebenumUrl = `${process.env.STRAPI_URL}/api/ebenum-nol2trs`;
    const ebenumResponse = await fetch(ebenumUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    });
    const ebenumData = await ebenumResponse.json();

    const ebenumCount = ebenumData.meta.pagination.total;

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

    res.status(200).send({ ebenum: ebenumCount, interview: interviewCount, newsic: newsicCount });
  } else {
    console.log('Unsupported method');
  }
}
