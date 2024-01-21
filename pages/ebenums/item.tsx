import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWRInfinite from 'swr/infinite';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import axios from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { Masonry } from 'masonic';
import { EbenumData } from 'types';
import { modalContainer } from '@/components/ModalStyling';
import { FormatDate } from '@/components/FormatDate';
import WatchDetail from '@/components/Watch';
import styles from '@/styles/watches.module.sass';

Modal.setAppElement('#__next');

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: '(min-width: 768px)' });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const getKey = (pageIndex: number, previousPageData: any) => {
  if (previousPageData && !previousPageData.length) return null;
  return `${process.env.NEXT_PUBLIC_API_URL}/api/ebenums?start=${pageIndex + 1}&count=20`;
};

export default function EbenumsItem() {
  const router = useRouter();

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const [target, setTarget] = useState<HTMLElement | null | undefined>(null);
  const itemId = Array.isArray(router.query.itemId) ? router.query.itemId[0] : router.query.itemId;

  const ebenums = data ? [].concat(...data) : [];
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

  const selectedWatch = Array.isArray(ebenums) ? ebenums.find((watch: any) => watch.idx === itemId) : undefined;

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (itemId !== undefined) {
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
  }, [itemId]);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 671) setColumnCount(1);
    else if (width >= 671 && width <= 922) setColumnCount(2);
    else if (width >= 922 && width <= 1396) setColumnCount(3);
    else setColumnCount(4);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isDesktop = useDesktop();

  const renderCard = ({ data }: { data: EbenumData }) => (
    <div className={styles.item}>
      <figure>
        <div className={styles.opengraph}>
          <div className={styles['og-container']}>
            {data.ebenumMetaData?.ownerAvatar ? (
              <img src={data.ebenumMetaData?.ogImage} alt="" />
            ) : (
              <div className={styles.thumbnails}>
                <img src={data.ebenumMetaData?.ogImage} alt="" className={styles['thumbnail-origin']} />
                <img src={data.ebenumMetaData?.ogImage} alt="" className={styles['thumbnail-background']} />
              </div>
            )}
            <div className={styles['og-info']}>
              <div className={styles.detail}>
                {data.ebenumMetaData?.ownerAvatar ? (
                  <img src={data.ebenumMetaData?.ownerAvatar} alt="" />
                ) : (
                  <img src={data.ebenumMetaData?.pressAvatar} alt="" />
                )}
                <div className={styles['user-info']}>
                  <Link key={data.idx} href={`/instead/${data.idx}`} scroll={false} shallow={true}>
                    <strong>{data.ebenumMetaData?.ogTitle}</strong>{' '}
                  </Link>
                  <div className={styles.user}>
                    <cite>
                      {data.ebenumMetaData?.ownerName
                        ? data.ebenumMetaData?.ownerName
                        : data.ebenumMetaData?.twitterCreator}
                    </cite>
                    {data.ebenumMetaData?.datePublished ? (
                      <time dateTime={data.ebenumMetaData?.datePublished}>
                        {FormatDate(data.ebenumMetaData?.datePublished)}
                      </time>
                    ) : (
                      <time dateTime={data.ebenumMetaData?.pressPublished}>
                        {FormatDate(`${data.ebenumMetaData?.pressPublished}`)}
                      </time>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </figure>
    </div>
  );

  const handleRefresh = async () => {
    window.location.reload();
  };
  const [columnCount, setColumnCount] = useState(1);

  return (
    <>
      <Modal
        isOpen={!!itemId}
        onRequestClose={() => router.push('/watches', undefined, { scroll: false })}
        contentLabel="Watch Modal"
        style={modalContainer}
      >
        <WatchDetail watchNews={selectedWatch} />
      </Modal>
      {isLoading && <div className={styles.loading}>뉴스를 불러오는 중입니다.</div>}
      {error && (
        <div className={styles.error}>
          <p>데이터를 불러오는데 실패했습니다.</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      )}
      {!isLoading && !error && (
        <div className={styles['watch-content']}>
          <PullToRefresh onRefresh={handleRefresh}>
            <Masonry
              items={ebenums || []}
              columnCount={columnCount}
              render={renderCard}
              key={ebenums.length}
              data-index={ebenums.length}
            />
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
