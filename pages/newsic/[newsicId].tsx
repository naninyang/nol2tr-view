import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { MusicParalinkData, NewsicParalinkData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import styled from '@emotion/styled';
import styles from '@/styles/Article.module.sass';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

const ClipboardIcon = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.misc.shareLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.misc.shareDark}) no-repeat 50% 50%/contain`,
  },
});

const YTmusicIcon = styled.i({
  background: `url(${images.misc.music}) no-repeat 50% 50%/contain`,
});

export default function articleDetail({
  articleData,
  musicData,
}: {
  articleData: NewsicParalinkData | null;
  musicData: any;
}) {
  const router = useRouter();

  const previousPageHandler = () => {
    const previousPage = sessionStorage.getItem('location');
    if (previousPage) {
      router.push(`${previousPage}`);
    } else {
      router.push('/');
    }
  };

  const [timeoutReached, setTimeoutReached] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!articleData) {
    if (timeoutReached) {
      return (
        <main className={styles.article}>
          <p className={styles.error}>
            기사를 불러오지 못했습니다. 삭제된 기사이거나 인터넷 속도가 느립니다.{' '}
            <Anchor href="/articles">뒤로가기</Anchor>
          </p>
        </main>
      );
    } else {
      return (
        <main className={styles.article}>
          <p className={styles.loading}>기사 읽는 중...</p>
        </main>
      );
    }
  }

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert('URL이 클립보드에 복사되었습니다!');
      })
      .catch((err) => {
        console.error('URL 복사에 실패했습니다:', err);
      });
  };

  return (
    <main className={styles.article}>
      <Seo
        pageTitles={`${articleData.attributes.subject} / 추천곡_ ${musicData.attributes.music} - ${originTitle}`}
        pageTitle={`${articleData.attributes.subject} / 추천곡_ ${musicData.attributes.music}`}
        pageDescription={articleData.attributes.summary}
        pageImg={
          articleData.attributes.platform === 'youtube'
            ? `https://i.ytimg.com/vi_webp/${articleData.attributes.vid}/maxresdefault.webp`
            : `https://cdn.dev1stud.io/nol2tr/${articleData.attributes.opengraph}.webp`
        }
        pageOgType={articleData.attributes.platform === 'youtube' ? 'video.other' : 'article'}
      />
      <div className="top-link">
        <button onClick={previousPageHandler} type="button">
          <BackButton />
          <span>뒤로가기</span>
        </button>
      </div>
      <article className={styles['article-news']}>
        <div className={styles.news}>
          {articleData.attributes.platform === 'youtube' ? (
            <YouTubeController videoId={articleData.attributes.vid} vi={articleData.attributes.vi} />
          ) : (
            <div className={styles.thumbnail}>
              {articleData.attributes.platform === 'naverNews' ? (
                <Anchor
                  href={`https://n.news.naver.com/article/${articleData.attributes.oid}/${articleData.attributes.aid}`}
                >
                  <span>기사 전문보기</span>
                  <img src={`https://cdn.dev1stud.io/nol2tr/${articleData.attributes.thumbnail}.webp`} alt="" />
                </Anchor>
              ) : (
                <Anchor
                  href={`https://entertain.naver.com/read?oid=${articleData.attributes.oid}&aid=${articleData.attributes.aid}`}
                >
                  <span>기사 전문보기</span>
                  <img src={`https://cdn.dev1stud.io/nol2tr/${articleData.attributes.thumbnail}.webp`} alt="" />
                </Anchor>
              )}
            </div>
          )}
          <header>
            <h1>
              {articleData.attributes.subject} <span>추천곡_ {musicData.attributes.music}</span>
            </h1>
            <div className={styles.function}>
              <button onClick={copyToClipboard}>
                <ClipboardIcon /> <span>URL 복사</span>
              </button>
              <time>기사 작성일 {articleData.attributes.created}</time>
            </div>
          </header>
          <p dangerouslySetInnerHTML={{ __html: articleData.attributes.description.replace(/\n/g, '<br />') }} />
          {articleData.attributes.fin !== null && (
            <p dangerouslySetInnerHTML={{ __html: articleData.attributes.fin.replace(/\n/g, '<br />') }} />
          )}
        </div>
        <hr />
        <div className={styles.music}>
          <h2>
            <strong>추천곡</strong> {musicData.attributes.music}
          </h2>
          {musicData.attributes.isMV ? (
            <>
              <YouTubeController
                videoId={musicData.attributes.videoid}
                start={musicData.attributes.start}
                vi={musicData.attributes.vvi}
                mv={musicData.attributes.isMV}
              />
              <div className={styles.ytMusic}>
                <Anchor href={`https://music.youtube.com/watch?v=${musicData.attributes.videoid}`}>
                  <YTmusicIcon />
                  <span>YouTube Music</span>에서 고음질로 듣기
                </Anchor>
              </div>
              <div className={styles.info}>
                <dl>
                  <div>
                    <div>
                      <dt>수록앨범</dt>
                      <dd>{musicData.attributes.album}</dd>
                    </div>
                  </div>
                  <div
                    data-single={musicData.attributes.instrument || musicData.attributes.cover === null ? true : false}
                  >
                    {musicData.attributes.instrument ? (
                      <div>
                        <dt>아티스트</dt>
                        {musicData.attributes.artist !== null ? (
                          <dd>{musicData.attributes.artist}</dd>
                        ) : (
                          <dd>{musicData.attributes.composer}</dd>
                        )}
                      </div>
                    ) : musicData.attributes.cover !== null ? (
                      <>
                        <div>
                          <dt>커버</dt>
                          <dd>{musicData.attributes.cover}</dd>
                        </div>
                        <div>
                          <dt>원곡</dt>
                          <dd>{musicData.attributes.artist}</dd>
                        </div>
                      </>
                    ) : (
                      <div>
                        <dt>노래</dt>
                        <dd>{musicData.attributes.artist}</dd>
                      </div>
                    )}
                  </div>
                  {musicData.attributes.composer === musicData.attributes.lyricist ? (
                    <div data-staff="+">
                      <div>
                        <dt>작곡/작사</dt>
                        <dd>{musicData.attributes.composer}</dd>
                      </div>
                    </div>
                  ) : (
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
                  )}
                </dl>
                {musicData.attributes.lyrics !== null && (
                  <p dangerouslySetInnerHTML={{ __html: musicData.attributes.lyrics.replace(/\n/g, '<br />') }} />
                )}
              </div>
            </>
          ) : (
            <>
              <div className={styles['music-info']}>
                <YouTubeController
                  videoId={musicData.attributes.videoid}
                  start={musicData.attributes.start}
                  vi={musicData.attributes.vvi}
                  mv={musicData.attributes.isMV}
                />
                <div className={styles.info}>
                  <div className={styles.ytMusic}>
                    <Anchor href={`https://music.youtube.com/watch?v=${musicData.attributes.videoid}`}>
                      <YTmusicIcon />
                      <span>YouTube Music</span>에서 고음질로 듣기
                    </Anchor>
                  </div>
                  <dl>
                    <div>
                      <dt>수록앨범</dt>
                      <dd>{musicData.attributes.album}</dd>
                    </div>
                    <div
                      data-single={
                        musicData.attributes.instrument || musicData.attributes.cover === null ? true : false
                      }
                    >
                      {musicData.attributes.instrument ? (
                        <div>
                          <dt>아티스트</dt>
                          {musicData.attributes.artist !== null ? (
                            <dd>{musicData.attributes.artist}</dd>
                          ) : (
                            <dd>{musicData.attributes.composer}</dd>
                          )}
                        </div>
                      ) : musicData.attributes.cover !== null ? (
                        <>
                          <div>
                            <dt>커버</dt>
                            <dd>{musicData.attributes.cover}</dd>
                          </div>
                          <div>
                            <dt>원곡</dt>
                            <dd>{musicData.attributes.artist}</dd>
                          </div>
                        </>
                      ) : (
                        <div>
                          <dt>노래</dt>
                          <dd>{musicData.attributes.artist}</dd>
                        </div>
                      )}
                    </div>
                    {musicData.attributes.composer === musicData.attributes.lyricist ? (
                      <div data-staff="+">
                        <div>
                          <dt>작곡/작사</dt>
                          <dd>{musicData.attributes.composer}</dd>
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </dl>
                </div>
              </div>
              <div className={styles.lyrics}>
                {musicData.attributes.lyrics !== null && (
                  <p dangerouslySetInnerHTML={{ __html: musicData.attributes.lyrics.replace(/\n/g, '<br />') }} />
                )}
              </div>
            </>
          )}
        </div>
      </article>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const newsicId = context.params?.newsicId;
  let articleData = null;
  let musicData = null;

  if (newsicId && typeof newsicId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsic?id=${newsicId.substring(14)}`);
    const articleResponse = (await response.json()) as { data: NewsicParalinkData };
    articleData = articleResponse.data;
    const musicResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/musics?musicId=${articleData.attributes.music}`,
    );
    const musicResponseData = (await musicResponse.json()) as { data: MusicParalinkData };
    musicData = musicResponseData.data;
  }

  if (!articleData) {
    return {
      props: {
        articleData: null,
      },
    };
  }

  return {
    props: {
      articleData,
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
