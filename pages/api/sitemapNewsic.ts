import type { NextApiRequest, NextApiResponse } from 'next';
import { formatDate } from '@/utils/strapi';

async function fetchAllNewsicData() {
  let response = await fetch(
    `${process.env.STRAPI_URL}/api/newsic-nol2trs?sort[0]=id:desc&pagination[page]=1&pagination[pageSize]=100`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  let data = await response.json();
  const pageCount = data.meta.pagination.pageCount;
  const allNewsData = [];
  for (let page = 1; page <= pageCount; page++) {
    response = await fetch(
      `${process.env.STRAPI_URL}/api/newsic-nol2trs?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=100`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
        },
      },
    );
    data = await response.json();
    allNewsData.push(...data.data);
  }

  return allNewsData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allNewsData = await fetchAllNewsicData();

    const newsDataProcessed = allNewsData.map((newsItem: any) => ({
      idx: `newsic/${formatDate(newsItem.attributes.createdAt)}${newsItem.id}`,
      created: newsItem.attributes.createdAt,
    }));

    res.status(200).send(newsDataProcessed);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
