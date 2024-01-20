import React, { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import axios, { AxiosError } from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { NaverItemsData } from 'types';
import { modalContainer } from '@/components/ModalStyling';
import ArticleDetail from '@/components/Article';
import AnchorLink from '@/components/Anchor';
import styles from '@/styles/articles.module.sass';

Modal.setAppElement('#__next');

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: '(min-width: 768px)' });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

function ArticlesItem() {
  const router = useRouter();

  const [waitingFor504, setWaitingFor504] = useState(false);

  const fetcher = async (url: string) => {
    try {
      const response = await axios.get(url);
      setWaitingFor504(false);
      return response.data;
    } catch (error) {
      if ((error as AxiosError).response?.status === 504) {
        setWaitingFor504(true);
      }
      throw error;
    }
  };

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/naverNews?start=${pageIndex + 1}&count=20`;
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

  const selectedArticle = Array.isArray(articles)
    ? articles.find((article: any) => article.idx === articleId)
    : undefined;

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

  const handleRefresh = async () => {
    window.location.reload();
  };

  const isDesktop = useDesktop();

  return (
    <>
      <Modal
        isOpen={!!articleId}
        onRequestClose={() => router.push('/articles', undefined, { scroll: false })}
        contentLabel="Article Modal"
        style={modalContainer}
      >
        <ArticleDetail articleItem={selectedArticle} />
      </Modal>
      {isLoading && (
        <div className={styles.loading}>
          <p>뉴스를 가져오는 중입니다.</p>
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
          <PullToRefresh onRefresh={handleRefresh}>
            <div className={styles['article-list']}>
              {articles.map((article: NaverItemsData) => (
                <article key={article.idx}>
                  <div className={styles.description}>
                    {isDesktop ? (
                      <Link
                        key={article.idx}
                        href={`/articles?articleId=${article.idx}`}
                        as={`/article-memorial/${article.idx}`}
                        scroll={false}
                        shallow={true}
                      >
                        <p
                          className={`${styles.comment} opinion`}
                          dangerouslySetInnerHTML={{ __html: article.description.replace(/\n/g, '<br />') }}
                        />
                      </Link>
                    ) : (
                      <Link key={article.idx} href={`/article-memorial/${article.idx}`} scroll={false} shallow={true}>
                        <p
                          className={`${styles.comment} opinion`}
                          dangerouslySetInnerHTML={{ __html: article.description.replace(/\n/g, '<br />') }}
                        />
                      </Link>
                    )}
                    <Image
                      src={`https://cdn.dev1stud.io/memorial/${article?.thumbnail}${
                        article?.thumbnail?.endsWith('.gif') ? '' : '.webp'
                      }`}
                      width={640}
                      height={480}
                      unoptimized
                      priority
                      alt=""
                    />
                  </div>
                  <div className={styles.opengraph}>
                    {article.entertainment ? (
                      <AnchorLink href={`https://n.news.naver.com/entertain/article/${article.oid}/${article.aid}`}>
                        <div className={styles['og-container']}>
                          <img src={article.newsMetaData?.ogImage} alt="" />
                          <div className={styles['og-info']}>
                            <div className={styles.created}>
                              <cite>{article.newsMetaData?.ogCreator}</cite>
                              <time>{article.created}</time>
                            </div>
                            <div className={styles.summary}>
                              <strong>{article.newsMetaData?.ogTitle}</strong>
                              <div className={styles.description}>
                                {article.newsMetaData?.ogDescription}
                                ...
                              </div>
                            </div>
                          </div>
                        </div>
                      </AnchorLink>
                    ) : (
                      <AnchorLink href={`https://n.news.naver.com/article/${article.oid}/${article.aid}`}>
                        <div className={styles['og-container']}>
                          <img src={article.newsMetaData?.ogImage} alt="" />
                          <div className={styles['og-info']}>
                            <div className={styles.created}>
                              <cite>{article.newsMetaData?.ogCreator}</cite>
                              <time>{article.created}</time>
                            </div>
                            <div className={styles.summary}>
                              <strong>{article.newsMetaData?.ogTitle}</strong>
                              <div className={styles.description}>
                                {article.newsMetaData?.ogDescription}
                                ...
                              </div>
                            </div>
                          </div>
                        </div>
                      </AnchorLink>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </PullToRefresh>
          {isReachingEnd !== undefined && (
            <div ref={setTarget} className={styles.ref}>
              {isReachingEnd === false && <p>뉴스를 불러오는 중입니다.</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ArticlesItem;
