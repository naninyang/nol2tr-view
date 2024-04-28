import { GetStaticPaths, GetStaticProps } from 'next';
import styled from '@emotion/styled';
import { NoticeParalinkData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Pages.module.sass';
import notices from '@/styles/Notice.module.sass';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

const NoticeContent = ({ data }: { data: any }) => {
  const renderChildren = (children: any) => {
    return children.map((child: any, index: number) => {
      if (child.type === 'text') {
        if (child.bold) {
          return <strong key={index}>{child.text}</strong>;
        }
        if (child.strikethrough) {
          return <s key={index}>{child.text}</s>;
        }
        if (child.bold === undefined && child.strikethrough === undefined) {
          return (
            <span
              key={index}
              dangerouslySetInnerHTML={{
                __html: child.text.replace(/\n/g, '<br />'),
              }}
            />
          );
        }
      } else if (child.type === 'link') {
        return (
          <Anchor key={index} href={child.url}>
            {renderChildren(child.children)}
          </Anchor>
        );
      }
    });
  };

  const renderContent = (content: any) => {
    return content.map((item: any, index: number) => {
      if (item.type === 'paragraph') {
        return <p key={index}>{renderChildren(item.children)}</p>;
      } else if (item.type === 'list') {
        const ListComponent = item.format === 'ordered' ? 'ol' : 'ul';
        return (
          <ListComponent key={index}>
            {item.children.map((listItem: any, listItemIndex: number) => (
              <li key={listItemIndex}>{renderChildren(listItem.children)}</li>
            ))}
          </ListComponent>
        );
      }
    });
  };

  return <div className={notices.description}>{renderContent(data)}</div>;
};

const Notice = ({ notice }: { notice: NoticeParalinkData | null }) => {
  const timestamp = Date.now();
  return (
    <main className={`${content.content} ${styles.pages} ${styles.notice} ${notices.notice}`}>
      {!notice ? (
        <p className={styles.loading}>
          <span>안내사항 불러오는 중</span>
          <i />
        </p>
      ) : (
        <>
          <Seo
            pageTitles={`${notice.attributes.subject} - ${originTitle}`}
            pageTitle={`${notice.attributes.subject}`}
            pageDescription={`${notice.attributes.description}`}
            pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
          />
          <div className="top-link">
            <Anchor href="/notices">
              <BackButton />
              <span>뒤로가기</span>
            </Anchor>
          </div>
          <article>
            <header>
              <h2>{notice.attributes.subject}</h2>
              <time dateTime={notice.attributes.createdAt}>{notice.attributes.created}</time>
            </header>
            <NoticeContent data={notice.attributes.content} />
          </article>
        </>
      )}
    </main>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const noticeId = context.params?.noticeId;
  let notice = null;

  if (noticeId && typeof noticeId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notices/?id=${noticeId.substring(14)}`);
    const noticeResponse = (await response.json()) as { data: NoticeParalinkData[] };
    notice = noticeResponse.data;
  }

  if (!notice) {
    return {
      props: {
        notice: null,
      },
    };
  }

  return {
    props: {
      notice,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Notice;
