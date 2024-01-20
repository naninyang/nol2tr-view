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

async function fetchYouTubeItemData() {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/youtube-memorials?pagination[page]=1&pagination[pageSize]=10000`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  return data.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newsData = await fetchYouTubeItemData();

    const newsDataProcessed = newsData.map((newsItem: any) => ({
      idx: `watch-news/${formatDate(newsItem.attributes.createdAt)}${newsItem.id}`,
      created: newsItem.attributes.createdAt,
    }));

    res.status(200).send(newsDataProcessed);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
