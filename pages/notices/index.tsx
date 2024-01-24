import { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import styled from '@emotion/styled';
import { NoticeData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Pages.module.sass';
import notice from '@/styles/Notice.module.sass';

interface NoticeProps {
  notices: NoticeData[];
}

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

const Notices: NextPage<NoticeProps> = ({ notices }) => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const [noticesData, setNoticesData] = useState<NoticeData[]>([]);
  useEffect(() => {
    setNoticesData(notices);
  }, [notices]);

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.pages} ${styles.notice}`}>
      <Seo
        pageTitles={`안내사항 - ${originTitle}`}
        pageTitle="안내사항"
        pageDescription="놀이터뷰 공지를 확인하세요"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className="top-link">
        {currentPage ? (
          <Anchor href={`/${currentPage}`}>
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        ) : (
          <Anchor href="/">
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        )}
      </div>
      <div className={styles['pages-content']}>
        <h1>
          <span>안내사항 Notice.</span>
        </h1>
        <div>
          <p>
            이 서비스는 Vercel, AWS, Google 그리고 NAVER와 관련이 없고,{' '}
            <span>큐레이터 코멘트는 언론사의 입장과 다를 수 있습니다.</span>
          </p>
          <p>
            뉴스 콘텐츠에 대한 저작권은 각 언론사에 있으며 <span>곡에 대한 저작권은 저작권리사에 있습니다.</span>
          </p>
        </div>
        <div className={notice.notices}>
          <hr />
          <ul>
            {noticesData.map((notice) => (
              <li key={notice.idx}>
                <Anchor key={notice.idx} href={`/notices/${notice.idx}`} scroll={false} shallow={true}>
                  <strong>
                    <span>{notice.subject}</span>
                  </strong>
                  <time>{notice.created}</time>
                </Anchor>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notices`);
  const data = await response.json();

  return {
    props: { notices: data },
  };
};

export default Notices;
