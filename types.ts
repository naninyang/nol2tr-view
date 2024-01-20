type NotionRichTextProperty = {
  rich_text: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
};

type NotionTitleProperty = {
  title: {
    type: 'text';
    text: {
      content: string;
    };
  }[];
};

export type NotionRawPage = {
  id: string;
  properties: {
    Description?: NotionTitleProperty;
    OID?: NotionRichTextProperty;
    Thumbnail?: NotionRichTextProperty;
    Subject?: NotionRichTextProperty;
    [key: string]: any;
  };
};

export type NotionPageResponse = {
  object: string;
  results: {
    object: string;
    id: string;
    properties: {
      description: {
        id: string;
        type: string;
        rich_text: Array<{
          type: string;
          text: {
            content: string;
            link: null | string;
          };
          annotations: {
            bold: boolean;
            italic: boolean;
            strikethrough: boolean;
            underline: boolean;
            code: boolean;
            color: string;
          };
          plain_text: string;
          href: null | string;
        }>;
      };
      [key: string]: any;
    }[];
    [key: string]: any;
  };
};

export type NotionRawResponse = {
  results: NotionRawPage[];
  next_cursor: string | null;
};

export interface NotionRichText {
  plain_text: string;
  href?: string | null;
}

export interface NotionDate {
  start: string;
}

export interface NaverCommentResult {
  properties: NaverProperties;
}

export interface NaverCommentResponse {
  results: NaverCommentResult[];
}

export interface YouTubeProperties {
  title: {
    title: NotionRichText[];
  };
  update: {
    date: NotionDate;
  };
  due: {
    checkbox: boolean;
  };
}

export interface NaverProperties {
  title: {
    title: NotionRichText[];
  };
  update: {
    date: NotionDate;
  };
  due: {
    checkbox: boolean;
  };
}

export interface YouTubeCommentResult {
  properties: YouTubeProperties;
}

export interface YouTubeCommentResponse {
  results: YouTubeCommentResult[];
}

export type Article = {
  idx: string;
  description: string;
  thumbnail: string;
  title: string;
  oid: string;
  aid: string;
  type?: string;
  newsMetaData?: {
    ogTitle: string;
    ogUrl: string;
    ogImage: string;
    ogDescription: string;
    ogCreator: string;
    datestampTimeContent: any;
    datestampTimeAttribute: any;
  };
};

export type CommentResponse = {
  collection: string;
  created: string;
  idx: string;
  username: string;
  comment: string;
};

export interface YouTubeItemData {
  idx: string;
  video_id: string;
  description: string;
  comment: string;
  created: string;
  title: string;
}

export interface YouTubeNewsRowData {
  attributes: {
    idx: string;
    type: string;
    videoId: string;
    description: string;
    comment: string;
    created: string;
    title: string;
  };
}

export interface NaverItemsData {
  idx: string;
  title: string;
  description: string;
  oid: string;
  aid: string;
  thumbnail: string;
  created: string;
  entertainment: boolean;
  newsMetaData: any;
}

export interface NaverItemData {
  attributes: {
    type: string;
    idx: string;
    created: string;
    title: string;
    description: string;
    oid: string;
    aid: string;
    thumbnail: string;
    entertainment: boolean;
  };
  metaData: any;
}

interface ArrayDataChild {
  text: string;
}

export interface ArrayData {
  children: ArrayDataChild[];
}

export interface OgData {
  ogImage?: string;
  ogCreator?: string;
  ogSiteName?: string;
  ogTitle?: string;
  ogDescription?: string;
  error?: string;
}

export interface EditorialItemsData {
  idx: string;
  title: string;
  org: any;
  articleNumber: string;
  thumbnail: string;
  created: string;
}

export interface EditorialItemData {
  attributes: {
    idx: string;
    title: string;
    org: any;
    articleNumber: string;
    thumbnail: string;
    created: string;
  };
  metaData: any;
}

export interface EditorialProps {
  editorialOrg: 'hani' | 'khan' | 'ohmynews' | 'vegannews' | 'vop';
  editorialCreated: string;
  editorialTitle: string;
  editorialNumber: string;
  editorialThumbnail: string;
}
