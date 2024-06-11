export interface BannerData {
  id: number;
  idx: number;
  type: string;
  order: number;
  subject: string;
  description: string;
  color: string;
  isLTR: boolean;
  isLight: boolean;
  interview: any;
}

export interface NewsData {
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
  interviewer?: string;
  interviewee?: string;
  musicData: any;
  fin: string;
  created: string;
}

export interface NewsParalinkData {
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
    content: any;
    interviewer?: string;
    interviewee?: string;
    music: string;
    fin: string;
    created: string;
    createdAt: string;
  };
  musicData: any;
}

export interface PlaylistData {
  id: string;
  idx: string;
  subject: string;
  summary: string;
  opengraph: string;
  musicData: any;
  articleData: any;
  created: string;
}

export interface PlaylistParalinkData {
  attributes: {
    idx: string;
    subject: string;
    summary: string;
    opengraph: string;
    music: any;
    article: any;
    created: string;
    createdAt: string;
  };
  musicData: any;
  articleData: any;
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
    content: any;
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
