import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Seo, { originTitle } from '@/components/Seo';
import AnchorLink from '@/components/Anchor';
import { images } from '@/components/images';
import content from '@/styles/content.module.sass';
import styles from '@/styles/pages.module.sass';

type DataResponse = {
  description: string;
};

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

export default function Notice() {
  const [data, setData] = useState<DataResponse | null>(null);
  const title = 'Notice';

  useEffect(() => {
    async function fetchDescriptionData() {
      try {
        const response = await fetch(`/api/pages?title=${title}`);
        const descriptionResponse = await response.json();
        setData(descriptionResponse);
      } catch (error) {
        console.error('Error fetching page info:', error);
      }
    }
    fetchDescriptionData();
  }, [title]);

  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.pages} ${styles.notice}`}>
      <Seo
        pageTitles={`안내사항 - ${originTitle}`}
        pageTitle="안내사항"
        pageDescription="내가 기억해야 할 뉴스"
        pageImg={`https://memorial.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <div className="top-link">
        {currentPage ? (
          <AnchorLink href={`/${currentPage}`}>
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        ) : (
          <AnchorLink href="/">
            <BackButton />
            <span>뒤로가기</span>
          </AnchorLink>
        )}
      </div>
      {data && (
        <div className={styles['pages-content']}>
          <h1>
            <span>안내사항 Notice.</span>
          </h1>
          <div dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
      )}
    </main>
  );
}
