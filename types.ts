export interface InterviewData {
  id: string;
  idx: string;
  subject: string;
  platform: string;
  vid: string;
  oid: string;
  aid: string;
  opengraph: string;
  thumbnail: string;
  summary: string;
  description: string;
  interviewer: string;
  interviewee: string;
  musicData: any;
  created: string;
}

export interface InterviewParalinkData {
  attributes: {
    idx: string;
    subject: string;
    platform: string;
    vi: string;
    vid: string;
    oid: string;
    aid: string;
    opengraph: string;
    thumbnail: string;
    summary: string;
    description: string;
    interviewer: string;
    interviewee: string;
    music: string;
    created: string;
    createdAt: string;
  };
  musicData: any;
}

export interface NewsicData {
  id: string;
  idx: string;
  subject: string;
  platform: string;
  vid: string;
  oid: string;
  aid: string;
  opengraph: string;
  thumbnail: string;
  summary: string;
  description: string;
  fin: string;
  musicData: any;
  created: string;
}

export interface NewsicParalinkData {
  attributes: {
    idx: string;
    subject: string;
    platform: string;
    vi: string;
    vid: string;
    oid: string;
    aid: string;
    opengraph: string;
    thumbnail: string;
    summary: string;
    description: string;
    fin: string;
    music: string;
    videoid: string;
    vvi: string;
    start: number;
    artist: string;
    album: string;
    composer: string;
    lyricist: string;
    lyrics: string;
    created: string;
    createdAt: string;
  };
  musicData: any;
}

export interface NoticeData {
  id: string;
  idx: string;
  platform: string;
  subject: string;
  description: string;
  created: string;
}

export interface NoticeParalinkData {
  attributes: {
    idx: string;
    platform: string;
    subject: string;
    description: string;
    created: string;
    createdAt: string;
  };
}

export interface MusicData {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  id: string;
  music: string;
  videoid: string;
  start: number;
  artist: string;
  cover: string;
  instrument: boolean;
  album: string;
  composer: string;
  lyricist: string;
  lyrics: string;
  vvi: string;
  isMV: boolean;
  isCC: boolean;
}

export interface MusicParalinkData {
  music: string;
  videoid: string;
  start: number;
  artist: string;
  cover: string;
  instrument: boolean;
  album: string;
  composer: string;
  lyricist: string;
  lyrics: string;
}
