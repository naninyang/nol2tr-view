import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const youtubeNewsUrl = `${process.env.STRAPI_URL}/api/youtube-memorials`;
    const youtubeNewsResponse = await fetch(youtubeNewsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    });
    const youtubeNewsData = await youtubeNewsResponse.json();

    const youtubeCount = youtubeNewsData.meta.pagination.total;

    const naverNewsUrl = `${process.env.STRAPI_URL}/api/naver-memorials`;
    const naverNewsResponse = await fetch(naverNewsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    });
    const naverNewsData = await naverNewsResponse.json();

    const naverCount = naverNewsData.meta.pagination.total;

    const editorialUrl = `${process.env.STRAPI_URL}/api/editorial-memorials`;
    const editorialResponse = await fetch(editorialUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    });
    const editorialData = await editorialResponse.json();

    const editorialCount = editorialData.meta.pagination.total;

    res.status(200).send({ youtube: youtubeCount, naver: naverCount, editorial: editorialCount });
  } else {
    console.log('Unsupported method');
  }
}
