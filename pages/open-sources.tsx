import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import styled from '@emotion/styled';
import Seo, { originTitle } from '@/components/Seo';
import AnchorLink from '@/components/Anchor';
import { images } from '@/components/images';
import content from '@/styles/content.module.sass';
import styles from '@/styles/open.module.sass';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

function OpenSources({ licenses }: { licenses: string[] }) {
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles['open_sources']}`}>
      <Seo
        pageTitles={`오픈소스 - ${originTitle}`}
        pageTitle="오픈소스"
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
      <div className={styles['open_sources-content']}>
        <h1>
          <span>오픈소스 Open Sources.</span>
        </h1>
        <dl>
          <div>
            <dt>기획/UX 디자인</dt>
            <dd>클로이 Chloe</dd>
          </div>
          <div>
            <dt>프론트엔드/백엔드 개발</dt>
            <dd>클로이 Chloe</dd>
          </div>
          <div>
            <dt>큐레이팅</dt>
            <dd>NEWS CURATORS</dd>
          </div>
        </dl>
        <div className={styles.list}>
          <hr />
          {licenses.map((license, index) => (
            <div key={index}>
              <pre>
                <code>{license}</code>
              </pre>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const markdownDir = path.join(process.cwd(), 'pages/licenses');
  const filenames = fs.readdirSync(markdownDir);
  const licenses = filenames.map((filename) => {
    const filePath = path.join(markdownDir, filename);
    return fs.readFileSync(filePath, 'utf8');
  });

  return {
    props: {
      licenses,
    },
  };
}

export default OpenSources;
