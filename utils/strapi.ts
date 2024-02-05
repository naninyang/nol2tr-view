import { NewsicData, InterviewData, EbenumData, NoticeData, MusicData } from 'types';

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
  const rowsData: InterviewData[] = await Promise.all(
    filesData.map(async (data: any) => {
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
  const rowsData: NewsicData[] = await Promise.all(
    filesData.map(async (data: any) => {
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

  return rowsData;
}

export async function getMusicData(music: string) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/musics-nol2trs/${music}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
    },
  });
  const data = await response.json();
  const musicData = data.data;
  const rowsData: MusicData = {
    id: musicData.id,
    music: musicData.attributes.music,
    videoid: musicData.attributes.videoid,
    artist: musicData.attributes.artist,
    instrument: musicData.attributes.instrument,
    album: musicData.attributes.album,
    composer: musicData.attributes.composer,
    lyricist: musicData.attributes.lyricist,
    lyrics: musicData.attributes.lyrics,
    start: musicData.attributes.start,
    vvi: musicData.attributes.vvi,
  };

  return rowsData;
}

export async function getMusicsData() {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/musics-nol2trs?sort[0]=id:desc&pagination[page]=1&pagination[pageSize]=1000`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const data = await response.json();
  const filesData = data.data;
  const rowsData: MusicData[] = filesData.map((data: any) => ({
    id: data.id,
    music: data.attributes.music,
    videoid: data.attributes.videoid,
    artist: data.attributes.artist,
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
    `${process.env.STRAPI_URL}/api/notice-nol2trs?sort[0]=id:desc&pagination[page]=1&pagination[pageSize]=1000`,
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
    platform: data.attributes.platform,
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
