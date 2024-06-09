import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { MusicParalinkData, NewsParalinkData, PlaylistParalinkData } from 'types';
import { formatDate } from '@/utils/strapi';
import Seo, { originTitle } from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import { DescriptionContent } from '@/components/Description';
import ReportVideo from '@/components/Report';
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
  newsData,
}: {
  articleData: PlaylistParalinkData | null;
  musicData: MusicParalinkData | null;
  newsData: NewsParalinkData | null;
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
          <div className="top-link">
            <Anchor href="/interviews">
              <BackButton />
              <span>뒤로가기</span>
            </Anchor>
          </div>
          <article>
            <div className={styles.news}>
              <YouTubeController videoId={'q2iExQiqiyg'} vi={'hq720'} />
              <header>
                <h1>
                  페이지를 찾을 수 없습니다. 404 Not Found 에러 <span>추천곡_ 체념</span>
                </h1>
              </header>
              <p>찾고자 하는 페이지가 존재하지 않으니 체념하고 뒤로 돌아가세요.</p>
            </div>
            <hr />
            <div className={styles.music}>
              <h2>
                <strong>추천곡</strong> 체념
              </h2>
              <YouTubeController videoId={'Ezo69U5bar4'} start={0} vi={'hq720'} mv={true} />
              <div className={styles.ytMusic}>
                <Anchor href={`https://music.youtube.com/watch?v=Ezo69U5bar4`}>
                  <YTmusicIcon />
                  <span>YouTube Music</span>에서 고음질로 듣기
                </Anchor>
              </div>
              <div className={styles.info}>
                <dl>
                  <div>
                    <div>
                      <dt>수록앨범</dt>
                      <dd>Like The Bible (2003)</dd>
                    </div>
                  </div>
                  <div data-single={false}>
                    <div>
                      <dt>커버</dt>
                      <dd>이영현</dd>
                    </div>
                    <div>
                      <dt>원곡</dt>
                      <dd>빅마마 (이영현 솔로곡)</dd>
                    </div>
                  </div>
                  <div data-staff="+">
                    <div>
                      <dt>작곡/작사</dt>
                      <dd>이영현</dd>
                    </div>
                  </div>
                </dl>
                <p>
                  행복했어 너와의 시간들
                  <br />
                  아마도 너는 힘들었겠지
                  <br />
                  너의 마음을 몰랐던 건 아니야
                  <br />
                  나도 느꼈었지만
                  <br />널 보내는게 널 떠나보내는게
                  <br />
                  아직은 익숙하지가 않아
                  <br />
                  그렇게 밖에 할 수 없던 니가 원망스러워
                  <br />왜 말 안했니 아님 못한거니
                  <br />
                  조금도 날 생각하지 않았니
                  <br />
                  좋아한다며 사랑한다며
                  <br />
                  이렇게 끝낼거면서
                  <br />왜 그런말을 했니
                  <br />널 미워해야만 하는 거니
                  <br />
                  아니면 내 탓을 해야만 하는 거니
                  <br />
                  시간을 돌릴수만 있다면
                  <br />
                  다시 예전으로 돌아가고 싶은 마음뿐이야
                  <br />왜 말 안했니 아님 못한거니
                  <br />
                  조금도 날 생각하지 않았니
                  <br />
                  좋아한다며 사랑한다며
                  <br />
                  이렇게 끝낼거면서 왜 그런말을 했니
                  <br />널 미워해야만 하는 거니
                  <br />
                  아니면 내 탓을 해야만 하는 거니
                  <br />
                  시간을 돌릴수만 있다면
                  <br />
                  다시 예전으로 돌아가고 싶은 마음뿐이야
                  <br />
                  그래 더 이상 묻지 않을게
                  <br />
                  내곁을 떠나고 싶다면 돌아보지 말고 떠나가
                  <br />
                  눈물은 흘리지 않을게
                  <br />
                  괜히 마음만 약해지니깐
                  <br />
                  내게서 멀어진 니 모습이 흐릿하게 보여
                  <br />
                  눈물이 나나봐
                  <br />널 많이 그리워할것 같아
                  <br />
                  참아야만 하겠지
                  <br />
                  잊혀질 수 있도록
                  <br />
                  다시 사랑같은거 하지 않을래
                  <br />내 마지막 사랑은
                  <br />
                  돌아선 너에게 주고 싶어서
                  <br />
                  행복하길 바래 나보다 좋은 여자
                  <br />
                  만나기를...
                </p>
              </div>
            </div>
          </article>
        </main>
      );
    } else {
      return (
        <main className={styles.article}>
          <Seo
            pageTitles={`404 NOT FOUND - ${originTitle}`}
            pageTitle={`404 NOT FOUND`}
            pageDescription={`서버 에러 또는 삭제/비공개된 영상`}
            pageImg={`https://nol2tr.dev1stud.io/missing.webp`}
            pageOgType={'video.other'}
            pageImgWidth={1920}
            pageImgHeight={1080}
          />
          <p className={styles.loading}>기사 읽어오는 중...</p>
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
        pageTitles={`${articleData.attributes.subject} - ${originTitle}`}
        pageTitle={`${articleData.attributes.subject}`}
        pageDescription={articleData.attributes.summary}
        pageImg={`https://cdn.dev1stud.io/nol2tr/${articleData.attributes.opengraph}.webp`}
        pageOgType={'article'}
      />
      <div className="top-link">
        <button onClick={previousPageHandler} type="button">
          <BackButton />
          <span>뒤로가기</span>
        </button>
      </div>
      <article className={styles['playlist-article']}>
        <header>
          <h1>{articleData.attributes.subject}</h1>
          <div className={styles.function}>
            <button onClick={copyToClipboard}>
              <ClipboardIcon /> <span>URL 복사</span>
            </button>
            <dl>
              <dt>기사 취합일</dt>
              <dd>
                <time>{articleData.attributes.created}</time>
              </dd>
            </dl>
          </div>
          <p>
            <i className="noto" />
            {articleData.attributes.summary}
            <i className="noto" />
          </p>
        </header>
        {Array.isArray(newsData) &&
          newsData.map((newsItem: any, index: number) => (
            <div className={styles.news} key={index}>
              <div className={styles.headline}>
                <h1>
                  기사 #{index + 1}: {newsItem.newsItem.attributes.subject}
                </h1>
                <div className={styles.function}>
                  <dl>
                    <div>
                      <dt>기사 작성일</dt>
                      <dd>
                        <time>{newsItem.newsItem.attributes.created}</time>
                      </dd>
                    </div>
                    {(newsItem.newsItem.attributes.platform === 'naverNews' ||
                      newsItem.newsItem.attributes.platform === 'naverEntertainment') && (
                      <div>
                        <dt>기사 링크</dt>
                        <dd>
                          {newsItem.newsItem.attributes.platform === 'naverNews' && (
                            <Anchor
                              href={`https://n.news.naver.com/article/${newsItem.newsItem.attributes.oid}/${newsItem.newsItem.attributes.aid}`}
                            >
                              <span>기사 전문보기</span>
                            </Anchor>
                          )}
                          {newsItem.newsItem.attributes.platform === 'naverEntertainment' && (
                            <Anchor
                              href={`https://entertain.naver.com/read?oid=${newsItem.newsItem.attributes.oid}&aid=${newsItem.newsItem.attributes.aid}`}
                            >
                              <span>기사 전문보기</span>
                            </Anchor>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              {newsItem.newsItem.attributes.vid && (
                <div className={styles.news}>
                  <YouTubeController videoId={newsItem.newsItem.attributes.vid} vi={newsItem.newsItem.attributes.vi} />
                </div>
              )}
              <DescriptionContent data={newsItem.newsItem.attributes.content} />
              {newsItem.newsItem.attributes.fin !== null && (
                <p
                  dangerouslySetInnerHTML={{ __html: newsItem.newsItem.attributes.fin.replace(/\n/g, '<br />') }}
                  aria-label="큐레이터 코멘트"
                />
              )}
            </div>
          ))}
        {Array.isArray(musicData) &&
          musicData.map((musicItem: any, index: number) => (
            <div className={styles.music} key={index}>
              <h2>
                <strong>추천곡 #{index + 1}</strong> {musicItem.musicItem.attributes.music}
              </h2>
              {musicItem.musicItem.attributes.isMV ? (
                <>
                  <YouTubeController
                    videoId={musicItem.musicItem.attributes.videoid}
                    start={musicItem.musicItem.attributes.start}
                    vi={musicItem.musicItem.attributes.vvi}
                    mv={musicItem.musicItem.attributes.isMV}
                  />
                  <div className={styles.ytMusic}>
                    <Anchor href={`https://music.youtube.com/watch?v=${musicItem.musicItem.attributes.videoid}`}>
                      <YTmusicIcon />
                      <span>YouTube Music</span>에서 고음질로 듣기
                    </Anchor>
                  </div>
                  <ReportVideo videoId={musicItem.musicItem.attributes.videoid} />
                  <div className={styles.info}>
                    <dl>
                      <div>
                        <div>
                          <dt>수록앨범</dt>
                          <dd>{musicItem.musicItem.attributes.album}</dd>
                        </div>
                      </div>
                      <div
                        data-single={
                          musicItem.musicItem.attributes.instrument || musicItem.musicItem.attributes.cover === null
                            ? true
                            : false
                        }
                      >
                        {musicItem.musicItem.attributes.instrument ? (
                          <div>
                            <dt>아티스트</dt>
                            {musicItem.musicItem.attributes.artist !== null ? (
                              <dd>{musicItem.musicItem.attributes.artist}</dd>
                            ) : (
                              <dd>{musicItem.musicItem.attributes.composer}</dd>
                            )}
                          </div>
                        ) : musicItem.musicItem.attributes.cover !== null ? (
                          <>
                            <div>
                              <dt>커버</dt>
                              <dd>{musicItem.musicItem.attributes.cover}</dd>
                            </div>
                            <div>
                              <dt>원곡</dt>
                              <dd>{musicItem.musicItem.attributes.artist}</dd>
                            </div>
                          </>
                        ) : (
                          <div>
                            <dt>노래</dt>
                            <dd>{musicItem.musicItem.attributes.artist}</dd>
                          </div>
                        )}
                      </div>
                      {musicItem.musicItem.attributes.composer === musicItem.musicItem.attributes.lyricist ? (
                        <div data-staff="+">
                          <div>
                            <dt>작곡/작사</dt>
                            <dd>{musicItem.musicItem.attributes.composer}</dd>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div>
                            <dt>작곡</dt>
                            <dd>{musicItem.musicItem.attributes.composer}</dd>
                          </div>
                          {musicItem.musicItem.attributes.lyricist !== null && (
                            <div>
                              <dt>작사</dt>
                              <dd>{musicItem.musicItem.attributes.lyricist}</dd>
                            </div>
                          )}
                        </div>
                      )}
                    </dl>
                    {musicItem.musicItem.attributes.lyrics !== null && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: musicItem.musicItem.attributes.lyrics.replace(/\n/g, '<br />'),
                        }}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles['music-info']}>
                    <YouTubeController
                      videoId={musicItem.musicItem.attributes.videoid}
                      start={musicItem.musicItem.attributes.start}
                      vi={musicItem.musicItem.attributes.vvi}
                      mv={musicItem.musicItem.attributes.isMV}
                    />
                    <div className={styles.info}>
                      <div className={styles.ytMusic}>
                        <Anchor href={`https://music.youtube.com/watch?v=${musicItem.musicItem.attributes.videoid}`}>
                          <YTmusicIcon />
                          <span>YouTube Music</span>에서 고음질로 듣기
                        </Anchor>
                      </div>
                      <dl>
                        <div>
                          <dt>수록앨범</dt>
                          <dd>{musicItem.musicItem.attributes.album}</dd>
                        </div>
                        <div
                          data-single={
                            musicItem.musicItem.attributes.instrument || musicItem.musicItem.attributes.cover === null
                              ? true
                              : false
                          }
                        >
                          {musicItem.musicItem.attributes.instrument ? (
                            <div>
                              <dt>아티스트</dt>
                              {musicItem.musicItem.attributes.artist !== null ? (
                                <dd>{musicItem.musicItem.attributes.artist}</dd>
                              ) : (
                                <dd>{musicItem.musicItem.attributes.composer}</dd>
                              )}
                            </div>
                          ) : musicItem.musicItem.attributes.cover !== null ? (
                            <>
                              <div>
                                <dt>커버</dt>
                                <dd>{musicItem.musicItem.attributes.cover}</dd>
                              </div>
                              <div>
                                <dt>원곡</dt>
                                <dd>{musicItem.musicItem.attributes.artist}</dd>
                              </div>
                            </>
                          ) : (
                            <div>
                              <dt>노래</dt>
                              <dd>{musicItem.musicItem.attributes.artist}</dd>
                            </div>
                          )}
                        </div>
                        {musicItem.musicItem.attributes.composer === musicItem.musicItem.attributes.lyricist ? (
                          <div data-staff="+">
                            <div>
                              <dt>작곡/작사</dt>
                              <dd>{musicItem.musicItem.attributes.composer}</dd>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <dt>작곡</dt>
                              <dd>{musicItem.musicItem.attributes.composer}</dd>
                            </div>
                            {musicItem.musicItem.attributes.lyricist !== null && (
                              <div>
                                <dt>작사</dt>
                                <dd>{musicItem.musicItem.attributes.lyricist}</dd>
                              </div>
                            )}
                          </div>
                        )}
                      </dl>
                      <ReportVideo videoId={musicItem.musicItem.attributes.videoid} />
                    </div>
                  </div>
                  <div className={styles.lyrics}>
                    {musicItem.musicItem.attributes.lyrics !== null && (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: musicItem.musicItem.attributes.lyrics.replace(/\n/g, '<br />'),
                        }}
                      />
                    )}
                  </div>
                </>
              )}
              <hr />
            </div>
          ))}
      </article>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const playlistId = context.params?.playlistId;
  let articleData = null;
  let musicIds = null;
  let newsIds = null;
  let musicData: MusicParalinkData[] | null = null;
  let newsData: NewsParalinkData[] | null = null;

  if (playlistId && typeof playlistId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlist?id=${playlistId.substring(14)}`);
    const articleResponse = (await response.json()) as { data: PlaylistParalinkData };
    const createdAt = articleResponse.data?.attributes?.createdAt;
    if (createdAt && formatDate(createdAt) === playlistId.substring(0, 14)) {
      articleData = articleResponse.data;
      musicIds = articleData.attributes.music.match(/\d+/g);
      newsIds = articleData.attributes.article.match(/\d+/g);

      if (musicIds) {
        musicData = await Promise.all(
          musicIds.map(async (id: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/musics?musicId=${id}`);
            const data = await response.json();
            return { musicItem: data.data };
          }),
        );
      }

      if (newsIds) {
        newsData = await Promise.all(
          newsIds.map(async (id: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsic?id=${id}`);
            const data = await response.json();
            return { newsItem: data.data };
          }),
        );
      }
    }
  }

  if (!articleData) {
    return {
      props: {
        articleData: null,
        musicData: null,
        newsData: null,
      },
    };
  }

  return {
    props: {
      idx: playlistId,
      articleData,
      musicData,
      newsData,
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
