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
  music: string;
  videoid: string;
  artist: string;
  album: string;
  composer: string;
  lyricist: string;
  lyrics: string;
  created: string;
  start: number;
}

export interface InterviewParalinkData {
  attributes: {
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
    music: string;
    videoid: string;
    artist: string;
    album: string;
    composer: string;
    lyricist: string;
    lyrics: string;
    created: string;
    start: number;
  };
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
  music: string;
  videoid: string;
  artist: string;
  album: string;
  composer: string;
  lyricist: string;
  lyrics: string;
  created: string;
  start: number;
}

export interface NewsicParalinkData {
  attributes: {
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
    music: string;
    videoid: string;
    artist: string;
    album: string;
    composer: string;
    lyricist: string;
    lyrics: string;
    created: string;
    start: number;
  };
}

export interface EbenumData {
  id: string;
  idx: string;
  subject: string;
  addr: string;
  description: string;
  ebenumMetaData?: {
    ogTitle: string;
    ogUrl: string;
    ogImage: string;
    ogDescription: string;
    ogSiteName?: string;
    twitterSite?: string;
    twitterCreator?: string;
    datePublished?: string;
    ownerAvatar?: string;
    ownerName?: string;
    pressPublished?: string;
    pressAvatar?: string;
  };
}

export interface EbenumPamalinkData {
  attributes: {
    idx: string;
    subject: string;
    addr: string;
    description: string;
    ebenumMetaData?: {
      ogTitle: string;
      ogUrl: string;
      ogImage: string;
      ogDescription: string;
      ogSiteName?: string;
      twitterSite?: string;
      twitterCreator?: string;
      datePublished?: string;
      ownerAvatar?: string;
      ownerName?: string;
      pressPublished?: string;
      pressAvatar?: string;
    };
  };
}

export interface NoticeData {
  id: string;
  idx: string;
  subject: string;
  description: string;
  created: string;
}

export interface NoticeParalinkData {
  attributes: {
    idx: string;
    subject: string;
    description: string;
    created: string;
    createdAt: string;
  };
}
