import React, { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import axios, { AxiosError } from 'axios';
import PullToRefresh from 'react-simple-pull-to-refresh';
import { EditorialItemsData, EditorialProps } from 'types';
import { modalContainer } from '@/components/ModalStyling';
// import EditorialDetail from '@/components/Editorial';
import AnchorLink from '@/components/Anchor';
import styles from '@/styles/editorials.module.sass';

Modal.setAppElement('#__next');

export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: '(min-width: 768px)' });
  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);
  return isDesktop;
}

function EditorialsItem() {
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
    return `/api/editorial?start=${pageIndex + 1}&count=20`;
  };

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 7000,
  });

  const [target, setTarget] = useState<HTMLElement | null | undefined>(null);
  const editorialId = Array.isArray(router.query.editorialId) ? router.query.editorialId[0] : router.query.editorialId;

  const editorials = data ? [].concat(...data) : [];
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

  const selectedEditorial = Array.isArray(editorials)
    ? editorials.find((editorial: any) => editorial.idx === editorialId)
    : undefined;

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (editorialId !== undefined) {
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
  }, [editorialId]);

  const handleRefresh = async () => {
    window.location.reload();
  };

  const NewspaperLink: React.FC<EditorialProps> = ({
    editorialOrg,
    editorialCreated,
    editorialTitle,
    editorialNumber,
    editorialThumbnail,
  }) => {
    const getNewspaperName = (org: string) => {
      const names: { [key: string]: string } = {
        hani: '한겨례신문',
        khan: '경향신문',
        ohmynews: '오마이뉴스',
        vegannews: '비건뉴스',
        vop: '민중의소리',
      };
      return names[org] || 'Unknown';
    };

    const getNewspaperURL = (org: string) => {
      const urls: { [key: string]: string } = {
        hani: 'https://www.hani.co.kr/arti/cartoon/hanicartoon/',
        khan: 'https://www.khan.co.kr/cartoon/grim-madang/article/', // 경향의 박순찬 화백 퇴사 문제로 그림마당으로 변경함
        ohmynews: 'https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=',
        vegannews: 'https://www.vegannews.co.kr/news/article.html?no=',
        vop: 'https://vop.co.kr/',
      };
      return urls[org] || 'Unknown';
    };

    return (
      <AnchorLink href={`${getNewspaperURL(editorialOrg)}${editorialNumber}`}>
        <div className={styles['og-container']}>
          <img src={`https://cdn.dev1stud.io/memorial/${editorialThumbnail}.webp`} alt="" />
          <div className={styles['og-info']}>
            <div className={styles.created}>
              <cite>{getNewspaperName(editorialOrg)}</cite>
              <time>{editorialCreated}</time>
            </div>
            <div className={styles.summary}>
              <strong>{editorialTitle}</strong>
            </div>
          </div>
        </div>
      </AnchorLink>
    );
  };

  return (
    <>
      {isLoading && (
        <div className={styles.loading}>
          <p>만평을 가져오는 중입니다.</p>
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
        <div className={styles['editorial-content']}>
          <PullToRefresh onRefresh={handleRefresh}>
            <div className={styles['editorial-list']}>
              {editorials.map((editorial: EditorialItemsData) => (
                <article key={editorial.idx}>
                  <div className={styles.opengraph}>
                    <NewspaperLink
                      editorialOrg={editorial.org}
                      editorialCreated={editorial.created}
                      editorialTitle={editorial.title}
                      editorialNumber={editorial.articleNumber}
                      editorialThumbnail={editorial.thumbnail}
                    />
                  </div>
                </article>
              ))}
            </div>
          </PullToRefresh>
          {isReachingEnd !== undefined && (
            <div ref={setTarget} className={styles.ref}>
              {isReachingEnd === false && <p>만평을 불러오는 중입니다.</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default EditorialsItem;
