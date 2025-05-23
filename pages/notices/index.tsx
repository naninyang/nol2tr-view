import { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { NoticeData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Pages.module.sass';
import notice from '@/styles/Notice.module.sass';
import { ArrowBackDark, ArrowBackLight } from '@/components/images';
import Link from 'next/link';

interface NoticeProps {
  notices: NoticeData[];
}

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${ArrowBackLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ArrowBackDark.src}) no-repeat 50% 50%/contain`,
  },
});

const Notices: NextPage<NoticeProps> = ({ notices }) => {
  const router = useRouter();

  const previousPageHandler = () => {
    const previousPage = sessionStorage.getItem('location');
    if (previousPage) {
      router.push(`${previousPage}`);
    } else {
      router.push('/');
    }
  };

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
        <button onClick={previousPageHandler} type="button">
          <BackButton />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className={styles['pages-content']}>
        <h1>
          <span>안내사항 nol2tr_log</span>
        </h1>
        <div>
          <p>중요 내용들을 공지해 드립니다.</p>
        </div>
        <div className={notice.notices}>
          <hr />
          <ul>
            {noticesData
              .filter((notice) => notice.platform === 'nol2tr')
              .map((notice) => (
                <li key={notice.idx}>
                  <Link key={notice.idx} href={`/notices/${notice.idx}`} scroll={false} shallow={true}>
                    <strong>
                      <span>{notice.subject}</span>
                    </strong>
                    <time>{notice.created}</time>
                  </Link>
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
