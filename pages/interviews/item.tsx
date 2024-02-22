import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import { InterviewData } from 'types';
import styles from '@/styles/Interviews.module.sass';

function ArticlesItem() {
  const router = useRouter();

  const [waitingFor504, setWaitingFor504] = useState(false);

  const fetcher = (url: string) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        setWaitingFor504(true);
        throw new Error('Network response was not ok');
      } else {
        setWaitingFor504(false);
      }
      return res.json();
    });

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/interviews?start=${pageIndex + 1}&count=20`;
  };

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 7000,
  });

  const [target, setTarget] = useState<HTMLElement | null | undefined>(null);
  const articleId = Array.isArray(router.query.articleId) ? router.query.articleId[0] : router.query.articleId;

  const articles = data ? [].concat(...data) : [];
  const isLoading = !data && !error;
  const isReachingEnd = data && data[data.length - 1]?.length < 20;

  const onIntersect: IntersectionObserverCallback = ([entry]) => {
    if (entry.isIntersecting && !isReachingEnd && !isLoading && (size === 0 || size === 1)) {
      setSize((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!target) return;
    const observer = new IntersectionObserver(onIntersect);
    observer.observe(target);
    return () => observer && observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!target || isLoading) return;
  }, [target, isLoading]);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (articleId !== undefined) {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [articleId]);

  return (
    <>
      {isLoading && (
        <div className={styles.loading}>
          <p>인터뷰 목록을 읽는 중입니다.</p>
        </div>
      )}
      {waitingFor504 && (
        <div className={styles.error}>
          <p>
            임시로 데이터를 불러 올 수 없는 상태입니다.
            <br />
            <button onClick={() => window.location.reload()}>다시 시도</button> 해 주세요 ㅠㅠ
            <br />
            (두어번 누르고 기다리시면 자동으로 불러옵니다.)
          </p>
        </div>
      )}
      {error && (
        <div className={styles.error}>
          <p>데이터를 불러오는데 실패했습니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles['article-content']}>
          <div className={styles['article-list']}>
            {articles.map((article: InterviewData) => (
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
          </div>
          {isReachingEnd !== undefined && (
            <div ref={setTarget} className={styles.ref}>
              {isReachingEnd === false && <p>인터뷰 목록을 읽는 중입니다.</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ArticlesItem;
