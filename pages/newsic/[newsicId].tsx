import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { MusicParalinkData, NewsicParalinkData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import styled from '@emotion/styled';
import styles from '@/styles/Newsic.module.sass';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

const Comment = styled.p({
  '&::before': {
    'body[data-theme="dark"] &': {
      background: `url(${images.misc.commentLight}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${images.misc.commentDark}) no-repeat 50% 50%/contain`,
    },
  },
});

export default function newsicDetail({
  newsicData,
  musicData,
}: {
  newsicData: NewsicParalinkData | null;
  musicData: any;
}) {
  const router = useRouter();
  let savedScrollPosition;

  const handleBackClick = () => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition_' + router.asPath);
    if (savedScrollPosition) {
      router.back();
    }
  };

  const [timeoutReached, setTimeoutReached] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!newsicData) {
    if (timeoutReached) {
      return (
        <main className={styles.newsic}>
          <p className={styles.error}>
            기사를 불러오지 못했습니다. 삭제된 기사이거나 인터넷 속도가 느립니다.{' '}
            <Anchor href="/newsics">뒤로가기</Anchor>
          </p>
        </main>
      );
    } else {
      return (
        <main className={styles.newsic}>
          <p className={styles.loading}>기사 읽는 중...</p>
        </main>
      );
    }
  }

  return (
    <main className={styles.newsic}>
      <Seo
        pageTitles={`${newsicData.attributes.subject} / 추천곡_ ${musicData.attributes.music} - ${originTitle}`}
        pageTitle={`${newsicData.attributes.subject} / 추천곡_ ${musicData.attributes.music}`}
        pageDescription={newsicData.attributes.summary}
        pageImg={
          newsicData.attributes.platform === 'youtube'
            ? `https://i.ytimg.com/vi_webp/${newsicData.attributes.vid}/maxresdefault.webp`
            : `https://cdn.dev1stud.io/nol2tr/${newsicData.attributes.opengraph}.webp`
        }
        pageOgType={newsicData.attributes.platform === 'youtube' ? 'video.other' : 'article'}
      />
      <div className="top-link">
        {savedScrollPosition ? (
          <button onClick={handleBackClick}>
            <BackButton />
            <span>뒤로가기</span>
          </button>
        ) : (
          <Anchor href="/newsics">
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        )}
      </div>
      <article className={styles['article-news']}>
        <header>
          <h1>
            {newsicData.attributes.subject} <span>추천곡_ {musicData.attributes.music}</span>
          </h1>
          <time>{newsicData.attributes.created}</time>
        </header>
        <div className={styles.news}>
          {newsicData.attributes.platform === 'youtube' ? (
            <YouTubeController videoId={newsicData.attributes.vid} vi={newsicData.attributes.vi} />
          ) : (
            <div className={styles.thumbnail}>
              {newsicData.attributes.platform === 'naverNews' ? (
                <Anchor
                  href={`https://n.news.naver.com/article/${newsicData.attributes.oid}/${newsicData.attributes.aid}`}
                >
                  <span>기사 전문보기</span>
                  <img src={`https://cdn.dev1stud.io/nol2tr/${newsicData.attributes.thumbnail}.webp`} alt="" />
                </Anchor>
              ) : (
                <Anchor
                  href={`https://entertain.naver.com/read?oid=${newsicData.attributes.oid}&aid=${newsicData.attributes.aid}`}
                >
                  <span>기사 전문보기</span>
                  <img src={`https://cdn.dev1stud.io/nol2tr/${newsicData.attributes.thumbnail}.webp`} alt="" />
                </Anchor>
              )}
            </div>
          )}
          <p dangerouslySetInnerHTML={{ __html: newsicData.attributes.description.replace(/\n/g, '<br />') }} />
        </div>
        <hr />
        <div className={styles.music}>
          <h2>
            <strong>추천곡</strong> {musicData.attributes.music}
          </h2>
          <YouTubeController
            videoId={musicData.attributes.videoid}
            start={musicData.attributes.start}
            vi={musicData.attributes.vvi}
          />
          <div className={styles.info}>
            <dl>
              <div>
                {musicData.attributes.instrument ? (
                  <div>
                    <dt>아티스트</dt>
                    <dd>{musicData.attributes.composer}</dd>
                  </div>
                ) : (
                  <div>
                    <dt>노래</dt>
                    <dd>{musicData.attributes.artist}</dd>
                  </div>
                )}
                <div>
                  <dt>수록앨범</dt>
                  <dd>{musicData.attributes.album}</dd>
                </div>
              </div>
              <div>
                <div>
                  <dt>작곡</dt>
                  <dd>{musicData.attributes.composer}</dd>
                </div>
                {musicData.attributes.lyricist !== null && (
                  <div>
                    <dt>작사</dt>
                    <dd>{musicData.attributes.lyricist}</dd>
                  </div>
                )}
              </div>
            </dl>
            {musicData.attributes.lyrics !== null && (
              <p dangerouslySetInnerHTML={{ __html: musicData.attributes.lyrics.replace(/\n/g, '<br />') }} />
            )}
          </div>
        </div>
      </article>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const newsicId = context.params?.newsicId;
  let newsicData = null;
  let musicData = null;

  if (newsicId && typeof newsicId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsic?id=${newsicId.substring(14)}`);
    const data = (await response.json()) as { data: NewsicParalinkData };
    newsicData = data.data;
    const musicResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/musics?musicId=${newsicData.attributes.music}`,
    );
    const musicResponseData = (await musicResponse.json()) as { data: MusicParalinkData };
    musicData = musicResponseData.data;
  }

  if (!newsicData) {
    return {
      props: {
        newsicData: null,
      },
    };
  }

  return {
    props: {
      newsicData,
      idx: newsicId,
      musicData,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
