import { NewsicData, InterviewData, NoticeData, MusicData, MusicParalinkData } from 'types';

export const formatDate = (datetime: string) => {
  const date = new Date(datetime);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export async function getInterviewData(page?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/interview-nol2trs?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=48`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const interviewResponse = await response.json();
  const interviewData = interviewResponse.data;
  const pageCount = interviewResponse.meta.pagination.pageCount;
  const articles: InterviewData[] = await Promise.all(
    interviewData.map(async (data: any) => {
      const musicData = await getMusicData(data.attributes.music);
      return {
        id: data.id,
        idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
        subject: data.attributes.subject,
        platform: data.attributes.platform,
        vid: data.attributes.vid,
        oid: data.attributes.oid,
        aid: data.attributes.aid,
        opengraph: data.attributes.opengraph,
        thumbnail: data.attributes.thumbnail,
        summary: data.attributes.summary,
        description: data.attributes.description,
        interviewer: data.attributes.interviewer,
        interviewee: data.attributes.interviewee,
        musicData,
        created: data.attributes.created,
        start: data.attributes.start,
      };
    }),
  );

  return { articles, pageCount: pageCount };
}

export async function getNewsicData(page?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/newsic-nol2trs?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=48`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const newsicResponse = await response.json();
  const newsicData = newsicResponse.data;
  const pageCount = newsicResponse.meta.pagination.pageCount;
  const articles: NewsicData[] = await Promise.all(
    newsicData.map(async (data: any) => {
      const musicData = await getMusicData(data.attributes.music);
      return {
        id: data.id,
        idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
        subject: data.attributes.subject,
        platform: data.attributes.platform,
        vid: data.attributes.vid,
        oid: data.attributes.oid,
        aid: data.attributes.aid,
        opengraph: data.attributes.opengraph,
        thumbnail: data.attributes.thumbnail,
        summary: data.attributes.summary,
        description: data.attributes.description,
        musicData,
        created: data.attributes.created,
      };
    }),
  );

  return { articles, pageCount: pageCount };
}

export async function getMusicData(music: string) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/musics-nol2trs/${music}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
    },
  });
  const musicResponse = await response.json();
  const musicData = musicResponse.data;
  const rowsData: MusicParalinkData = {
    music: musicData.attributes.music,
    videoid: musicData.attributes.videoid,
    artist: musicData.attributes.artist,
    cover: musicData.attributes.cover,
    instrument: musicData.attributes.instrument,
    album: musicData.attributes.album,
    composer: musicData.attributes.composer,
    lyricist: musicData.attributes.lyricist,
    lyrics: musicData.attributes.lyrics,
    start: musicData.attributes.start,
  };

  return rowsData;
}

export async function getMusicsData(page: number, pageSize: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/musics-nol2trs?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const musicsResponse = await response.json();
  const musicsData = musicsResponse.data;
  const rowsData: MusicData[] = musicsData.map((data: any) => ({
    id: data.id,
    music: data.attributes.music,
    videoid: data.attributes.videoid,
    artist: data.attributes.artist,
    cover: data.attributes.cover,
    instrument: data.attributes.instrument,
    album: data.attributes.album,
    composer: data.attributes.composer,
    lyricist: data.attributes.lyricist,
    lyrics: data.attributes.lyrics,
    start: data.attributes.start,
    vvi: data.attributes.vvi,
  }));
  return rowsData;
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
  const noticeResponse = await response.json();
  const filesData = noticeResponse.data;
  const rowsData: NoticeData[] = filesData.map((data: any) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    platform: data.attributes.platform,
    subject: data.attributes.subject,
    description: data.attributes.description,
    created: data.attributes.created,
  }));

  return rowsData;
}
