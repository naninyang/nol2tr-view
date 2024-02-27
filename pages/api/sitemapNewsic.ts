import type { NextApiRequest, NextApiResponse } from 'next';

const formatDate = (datetime: string) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

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
  let allNewsData = [];
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
