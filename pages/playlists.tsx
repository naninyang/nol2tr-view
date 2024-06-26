import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NewsData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import PageName from '@/components/PageName';
import { Pagination } from '@/components/Pagination';
import styles from '@/styles/Articles.module.sass';

function Playlist({ articles, error, currentPage }: { articles: any; error: string; currentPage: number }) {
  const router = useRouter();
  const timestamp = Date.now();

  useEffect(() => {
    localStorage.removeItem('currentPage');
  }, []);

  useEffect(() => {
    sessionStorage.setItem('location', router.asPath);
  }, [router.asPath]);

  return (
    <main className={styles.articles}>
      <Seo
        pageTitles={`플레이리스트 - ${originTitle}`}
        pageTitle="플레이리스트"
        pageDescription="News Playlist"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <PageName pageName="플레이리스트" />
      <div className={styles.list}>
        {error ? (
          <div className={styles.error}>
            <p>데이터를 불러오는데 실패했습니다.</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        ) : (
          <div className={styles['article-content']}>
            {Array.isArray(articles.articles) && (
              <div className={styles['article-list']}>
                {articles.articles.map((article: NewsData) => (
                  <article key={article.idx}>
                    <Link key={article.idx} href={`/playlist/${article.idx}`} scroll={true} shallow={true}>
                      <img src={`https://cdn.dev1stud.io/nol2tr/${article.opengraph}.webp`} alt="" />
                      <h3>{article.subject}</h3>
                      <p className={styles.summary}>{article.summary}</p>
                      <dl className={styles.recommended}>
                        <dt>
                          <i />
                          <span>추천곡</span>
                        </dt>
                        <dd>{article.musicData.music}</dd>
                      </dl>
                    </Link>
                  </article>
                ))}
                <Pagination currentPage={currentPage} pageCount={articles.pageCount} sorting={'newsics'} />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Playlist;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentPage = Number(context.query.page) || 1;
  let articles = null;
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlist?page=${currentPage}&pageSize=48`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    articles = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return {
    props: {
      articles,
      error,
      currentPage,
    },
  };
};
