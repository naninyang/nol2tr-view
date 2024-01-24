import { NewsicData, InterviewData, EbenumData, NoticeData } from 'types';

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

export async function getInterviewData(start?: number, count?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/interview-nol2trs?sort[0]=id:desc&pagination[page]=${start}&pagination[pageSize]=${count}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  const filesData = data.data;
  const rowsData: InterviewData[] = filesData.map((data: any) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    subject: data.attributes.subject,
    platform: data.attributes.platform,
    vid: data.attributes.vid,
    oid: data.attributes.oid,
    aid: data.attributes.aid,
    thumbnail: data.attributes.thumbnail,
    summary: data.attributes.summary,
    description: data.attributes.description,
    interviewer: data.attributes.interviewer,
    interviewee: data.attributes.interviewee,
    music: data.attributes.music,
    videoid: data.attributes.videoid,
    artist: data.attributes.artist,
    album: data.attributes.album,
    composer: data.attributes.composer,
    lyricist: data.attributes.lyricist,
    lyrics: data.attributes.lyrics,
    created: data.attributes.created,
    start: data.attributes.start,
  }));

  return rowsData;
}

export async function getNewsicData(start?: number, count?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/newsic-nol2trs?sort[0]=id:desc&pagination[page]=${start}&pagination[pageSize]=${count}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  const filesData = data.data;
  const rowsData: NewsicData[] = filesData.map((data: any) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    subject: data.attributes.subject,
    platform: data.attributes.platform,
    vid: data.attributes.vid,
    oid: data.attributes.oid,
    aid: data.attributes.aid,
    thumbnail: data.attributes.thumbnail,
    summary: data.attributes.summary,
    description: data.attributes.description,
    music: data.attributes.music,
    videoid: data.attributes.videoid,
    artist: data.attributes.artist,
    album: data.attributes.album,
    composer: data.attributes.composer,
    lyricist: data.attributes.lyricist,
    lyrics: data.attributes.lyrics,
    created: data.attributes.created,
    start: data.attributes.start,
  }));

  return rowsData;
}

export async function getEbenumData(start?: number, count?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/ebenum-nol2trs?sort[0]=id:desc&pagination[page]=${start}&pagination[pageSize]=${count}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  const filesData = data.data;
  const rowsData: EbenumData[] = filesData.map((data: any) => ({
    id: `${data.id}`,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    subject: data.attributes.subject,
    addr: data.attributes.addr,
    description: data.attributes.description,
  }));

  const fullData = await Promise.all(
    rowsData.map(async (preview) => {
      const ebenumMetaData = await fetchPreviewMetadata(preview.addr);
      return {
        ...preview,
        ebenumMetaData,
      };
    }),
  );

  return fullData;
}

export async function getNoticeData() {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/notice-nol2trs?sort[0]=id:desc&pagination[page]=1&pagination[pageSize]=100`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  const filesData = data.data;
  const rowsData: NoticeData[] = filesData.map((data: any) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    subject: data.attributes.subject,
    description: data.attributes.description,
    created: data.attributes.created,
  }));

  return rowsData;
}

async function fetchPreviewMetadata(url: string) {
  try {
    const response = await fetch(`${process.env.PREVIEW_API_URL}?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch article metadata', error);
    return {};
  }
}
