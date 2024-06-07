import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { NewsData } from 'types';
import Seo from '@/components/Seo';
import styles from '@/styles/Home.module.sass';
import Anchor from '@/components/Anchor';
import styled from '@emotion/styled';
import { images } from '@/components/images';

const MoreIcon = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.moreLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.moreDark}) no-repeat 50% 50%/contain`,
  },
});

const Headline = styled.h2({
  '& i': {
    '&[data-page="/interviews"]': {
      'body[data-theme="dark"] &': {
        background: `url(${images.tab.interview.defaultLight}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${images.tab.interview.defaultDark}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/newsics"]': {
      'body[data-theme="dark"] &': {
        background: `url(${images.tab.newsic.defaultLight}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${images.tab.newsic.defaultDark}) no-repeat 50% 50%/contain`,
      },
    },
  },
});

export default function Home({ interviews, newsics, error }: { interviews: any; newsics: any; error: string }) {
  useEffect(() => {
    localStorage.removeItem('currentPage');
  }, []);

  const timestamp = Date.now();

  return (
    <main className={styles.home}>
      <Seo
        pageTitle="놀이터뷰 nol2tr_view"
        pageDescription="인터뷰와 뉴스에 맞는 곡을 추천해주는 놀이터뷰"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className={styles.content}>
        {error ? (
          <div className={styles.error}>
            <p>데이터를 불러오는데 실패했습니다.</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        ) : (
          <div className={styles['article-content']}>
            <section>
              <div className={styles.headline}>
                <Headline>
                  <Anchor href="/interviews">
                    <i data-page="/interviews" />
                    <span>Latest 2nterview</span>
                  </Anchor>
                </Headline>
                <Anchor href="/interviews">
                  <MoreIcon />
                  <span>더 보기</span>
                </Anchor>
              </div>
              {Array.isArray(interviews.articles) && (
                <div className={styles['article-list']}>
                  {interviews.articles.map((article: NewsData) => (
                    <article key={article.idx}>
                      <Link key={article.idx} href={`/interview/${article.idx}`} scroll={false} shallow={true}>
                        {article.platform === 'youtube' ? (
                          <img src={`https://i.ytimg.com/vi_webp/${article.vid}/maxresdefault.webp`} alt="" />
                        ) : (
                          <img src={`https://cdn.dev1stud.io/nol2tr/${article.opengraph}.webp`} alt="" />
                        )}
                        <h3>{article.subject}</h3>
                        <p className={styles.summary}>{article.summary}</p>
                        <dl className={styles.people}>
                          <div>
                            <dt>인터뷰어</dt>
                            <dd>{article.interviewer}</dd>
                          </div>
                          <div>
                            <dt>인터뷰이</dt>
                            <dd>{article.interviewee}</dd>
                          </div>
                        </dl>
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
                </div>
              )}
            </section>
            <section>
              <div className={styles.headline}>
                <Headline>
                  <Anchor href="/newsics">
                    <i data-page="/newsics" />
                    <span>Latest Newsic</span>
                  </Anchor>
                </Headline>
                <Anchor href="/newsics">
                  <MoreIcon />
                  <span>더 보기</span>
                </Anchor>
              </div>
              {Array.isArray(newsics.articles) && (
                <div className={styles['article-list']}>
                  {newsics.articles.map((article: NewsData) => (
                    <article key={article.idx}>
                      <Link key={article.idx} href={`/interview/${article.idx}`} scroll={false} shallow={true}>
                        {article.platform === 'youtube' ? (
                          <img src={`https://i.ytimg.com/vi_webp/${article.vid}/maxresdefault.webp`} alt="" />
                        ) : (
                          <img src={`https://cdn.dev1stud.io/nol2tr/${article.opengraph}.webp`} alt="" />
                        )}
                        <h3>{article.subject}</h3>
                        <p className={styles.summary}>{article.summary}</p>
                        <dl className={styles.people}>
                          <div>
                            <dt>인터뷰어</dt>
                            <dd>{article.interviewer}</dd>
                          </div>
                          <div>
                            <dt>인터뷰이</dt>
                            <dd>{article.interviewee}</dd>
                          </div>
                        </dl>
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
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let interviews = null;
  let newsics = null;
  let error = null;

  try {
    const interviewResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interview?page=1&pageSize=4`);
    if (!interviewResponse.ok) {
      throw new Error('Network response was not ok');
    }
    interviews = await interviewResponse.json();
    const newsicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsic?page=1&pageSize=4`);
    if (!newsicResponse.ok) {
      throw new Error('Network response was not ok');
    }
    newsics = await newsicResponse.json();
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return {
    props: {
      interviews,
      newsics,
      error,
    },
  };
};
