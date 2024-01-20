import { NotionPageResponse } from 'types';
import { Client } from '@notionhq/client';
export const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function getCommentData() {
  const response = await notion.databases.query({ database_id: process.env.NOTION_DATABASE_ID_COMMENTS! });
  const rowsData = response.results.map((result: any) => {
    return {
      collection: result.properties.collection?.title[0]?.plain_text || '',
      created: result.properties.created?.date?.start || '',
      idx: result.properties.idx?.rich_text[0]?.plain_text || '',
      username: result.properties.username?.rich_text[0]?.plain_text || '',
      comment: result.properties.comment?.rich_text[0]?.plain_text || '',
    };
  });
  const sortedRowsData = rowsData.sort((a, b) => b.created.localeCompare(a.created));
  return sortedRowsData;
}

export async function getPageInfo(titleValue: string): Promise<string | null> {
  const databaseId = process.env.NOTION_DATABASE_ID_PAGE as string;

  try {
    const response = (await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'name',
        rich_text: {
          contains: titleValue,
        },
      },
      page_size: 1,
    })) as any as NotionPageResponse;

    if (response.results.length > 0 && response.results[0].properties.description) {
      const description = response.results[0].properties.description.rich_text[0]?.plain_text || null;
      return description;
    }
  } catch (error) {
    console.error('Error fetching page info:', error);
  }

  return null;
}
