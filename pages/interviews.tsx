import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { InterviewData, NewsicData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import PageName from '@/components/PageName';
import { Pagination } from '@/components/Pagination';
import styles from '@/styles/Interviews.module.sass';

function Interviews({ articles, error, currentPage }: { articles: any; error: string; currentPage: number }) {
  const router = useRouter();
  const timestamp = Date.now();

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'interviews');
  }, []);

  return (
    <main className={styles.articles}>
      <Seo
        pageTitles={`2인터뷰 - ${originTitle}`}
        pageTitle="2인터뷰"
        pageDescription="2인 인터뷰"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <PageName pageName="2인터뷰" />
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
                {articles.articles.map((article: InterviewData) => (
                  <article key={article.idx}>
                    {article.platform === 'youtube' ? (
                      <img src={`https://i.ytimg.com/vi_webp/${article.vid}/maxresdefault.webp`} alt="" />
                    ) : (
                      <img src={`https://cdn.dev1stud.io/nol2tr/${article.opengraph}.webp`} alt="" />
                    )}
                    <h3>
                      <Link key={article.idx} href={`/interview/${article.idx}`} scroll={false} shallow={true}>
                        {article.subject}
                      </Link>
                    </h3>
                    <p className={styles.summary}>{article.summary}</p>
                    <dl>
                      <div>
                        <dt>인터뷰어</dt>
                        <dd>{article.interviewer}</dd>
                      </div>
                      <div>
                        <dt>인터뷰이</dt>
                        <dd>{article.interviewee}</dd>
                      </div>
                    </dl>
                    <p className={styles.recommended}>{article.musicData.music}</p>
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

export default Interviews;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentPage = Number(context.query.page) || 1;
  let articles = null;
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interviews?page=${currentPage}`);
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
