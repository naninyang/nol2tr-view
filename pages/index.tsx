import React, { useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Slider from 'react-slick';
import { useMediaQuery } from 'react-responsive';
import styled from '@emotion/styled';
import { BannerData, NewsData } from 'types';
import Seo from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { rem } from '@/styles/designSystem';
import styles from '@/styles/Home.module.sass';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  ArrowMoreDark,
  ArrowMoreLight,
  SlideNextDark,
  SlideNextLight,
  SlidePauseDark,
  SlidePauseLight,
  SlidePlayDark,
  SlidePlayLight,
  SlidePrevDark,
  SlidePrevLight,
  TabInterviewDefaultDark,
  TabInterviewDefaultLight,
  TabNewsicDefaultDark,
  TabNewsicDefaultLight,
  TabPlaylistDefaultDark,
  TabPlaylistDefaultLight,
} from '@/components/images';

const MoreIcon = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${ArrowMoreLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ArrowMoreDark.src}) no-repeat 50% 50%/contain`,
  },
});

const Headline = styled.h2({
  '& i': {
    '&[data-page="/interviews"]': {
      'body[data-theme="dark"] &': {
        background: `url(${TabInterviewDefaultLight.src}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${TabInterviewDefaultDark.src}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/newsics"]': {
      'body[data-theme="dark"] &': {
        background: `url(${TabNewsicDefaultLight.src}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${TabNewsicDefaultDark.src}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/playlists"]': {
      'body[data-theme="dark"] &': {
        background: `url(${TabPlaylistDefaultLight.src}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${TabPlaylistDefaultDark.src}) no-repeat 50% 50%/contain`,
      },
    },
  },
});

const NextIcon = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${SlideNextLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${SlideNextDark.src}) no-repeat 50% 50%/contain`,
  },
});

const PauseIcon = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${SlidePauseLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${SlidePauseDark.src}) no-repeat 50% 50%/contain`,
  },
});

const PlayIcon = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${SlidePlayLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${SlidePlayDark.src}) no-repeat 50% 50%/contain`,
  },
});

const PrevIcon = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${SlidePrevLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${SlidePrevDark.src}) no-repeat 50% 50%/contain`,
  },
});

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ query: `(max-width: ${rem(575)}` });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  return isMobile;
}

const LoadingIndicator = ({ isInterview }: { isInterview: boolean }) => {
  const loadingBlocks = Array.from({ length: 4 }, (_, index) => index);
  return (
    <>
      {loadingBlocks.map((_, index) => (
        <div className={styles.article} key={index} aria-hidden="true">
          <div className={styles.fake}>
            <i className={styles.skeleton} />
            <div className={`${styles.headline} ${styles.skeleton}`} />
            <div className={`${styles.paragraph} ${styles.skeleton}`} />
            {isInterview && (
              <div className={styles.dl}>
                <div className={styles.skeleton} />
                <div className={styles.skeleton} />
              </div>
            )}
            <div className={`${styles.music} ${styles.skeleton}`} />
          </div>
        </div>
      ))}
    </>
  );
};

export default function Home({ banner, bannerError }: { banner: any; interviews: any; bannerError: string }) {
  useEffect(() => {
    localStorage.removeItem('currentPage');
  }, []);

  const timestamp = Date.now();
  const isMobile = useMobile();

  function Background({ color, ltr }: { color: string; ltr: boolean }) {
    const hexToRgb = (hex: string) => {
      hex = hex.replace(/^#/, '');
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      return { r, g, b };
    };

    const rgbColor = hexToRgb(color);
    return (
      <div className={styles.nol2tr}>
        {isMobile ? (
          <>
            <div
              style={{
                background: `linear-gradient(180deg, rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0) 0%, var(--default-bg-rgba) 100%)`,
              }}
            />
            <div />
          </>
        ) : (
          <>
            <div
              style={{
                background: ltr
                  ? `linear-gradient(270deg, rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0) 0%, rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.9) 100%)`
                  : `linear-gradient(90deg, rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0) 0%, rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.9) 100%)`,
              }}
            />
            <div style={{ backgroundColor: `#${color}` }} />
          </>
        )}
      </div>
    );
  }

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    centerPadding: '14%',
    centerMode: isMobile ? false : true,
    className: 'center',
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5200,
    arrows: false,
    afterChange: (current: number) => setCurrentSlide(current),
  };

  const toggleAutoplay = () => {
    if (isPlaying) {
      sliderRef.current?.slickPause();
    } else {
      sliderRef.current?.slickPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const [interviewData, setInverviewData] = useState<NewsData | null>(null);
  const [newsicData, setNewsicData] = useState<NewsData | null>(null);
  const [playlistData, setPlaylistData] = useState<NewsData | null>(null);

  const [interviewLoading, setInterviewLoading] = useState(true);
  const [newsicLoading, setNewsicLoading] = useState(true);
  const [playlistLoading, setPlaylistLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch('/api/interview?page=1&pageSize=4');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let data = await response.json();
        setInverviewData(data);
        setInterviewLoading(false);

        response = await fetch('/api/newsic?page=1&pageSize=4');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        data = await response.json();
        setNewsicData(data);
        setNewsicLoading(false);

        response = await fetch('/api/playlist?page=1&pageSize=4');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        data = await response.json();
        setPlaylistData(data);
        setPlaylistLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('알 수 없는 오류');
        }
        setInterviewLoading(false);
        setNewsicLoading(false);
        setPlaylistLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className={styles.home}>
      <Seo
        pageTitle="놀이터뷰 nol2tr_view"
        pageDescription="인터뷰와 뉴스에 맞는 곡을 추천해주는 놀이터뷰"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className={styles.content}>
        {(bannerError || error) && (
          <div className={styles.error}>
            <p>데이터를 불러오는데 실패했습니다.</p>
            <button onClick={() => window.location.reload()}>다시 시도</button>
          </div>
        )}
        {(!bannerError || !error) && (
          <div className={styles['article-content']}>
            {banner && (
              <div className={styles.banner}>
                <Slider ref={sliderRef} {...settings}>
                  {Array.isArray(banner) &&
                    banner
                      .sort((a, b) => a.order - b.order)
                      .map((banner: BannerData) => (
                        <div key={banner.order}>
                          {isMobile ? (
                            <Anchor
                              href={`/${banner.type}/${banner.idx}`}
                              style={{
                                background: `url(https://cdn.dev1stud.io/nol2tr/banner/${banner.type}-${banner.idx}.webp) no-repeat 0 0/contain`,
                              }}
                            >
                              <div className={styles.summary}>
                                <p>{banner.subject}</p>
                                <div className={styles.tail}>
                                  <em>“{banner.description}”</em>
                                  {banner.interview && (
                                    <dl>
                                      {Array.isArray(banner.interview) &&
                                        banner.interview.map((interview: any, index: number) => (
                                          <React.Fragment key={index}>
                                            {interview.interviewer && (
                                              <div>
                                                <dt>인터뷰어</dt>
                                                <dd>{interview.interviewer}</dd>
                                              </div>
                                            )}
                                            {interview.interviewee && (
                                              <div>
                                                <dt>인터뷰이</dt>
                                                <dd>{interview.interviewee}</dd>
                                              </div>
                                            )}
                                          </React.Fragment>
                                        ))}
                                    </dl>
                                  )}
                                </div>
                              </div>
                              <Background color={banner.color} ltr={banner.isLTR} />
                            </Anchor>
                          ) : (
                            <Anchor
                              href={`/${banner.type}/${banner.idx}`}
                              className={banner.isLTR ? styles.ltr : styles.rtl}
                              style={{
                                background: banner.isLTR
                                  ? `url(https://cdn.dev1stud.io/nol2tr/banner/${banner.type}-${banner.idx}.webp) no-repeat 100% 50%/contain`
                                  : `url(https://cdn.dev1stud.io/nol2tr/banner/${banner.type}-${banner.idx}.webp) no-repeat 0 50%/contain`,
                              }}
                            >
                              <div className={styles.summary} style={{ color: banner.isLight ? '#000' : '#fff' }}>
                                <p>{banner.subject}</p>
                                <div className={styles.tail}>
                                  <em>“{banner.description}”</em>
                                  {banner.interview && (
                                    <dl>
                                      {Array.isArray(banner.interview) &&
                                        banner.interview.map((interview: any, index: number) => (
                                          <React.Fragment key={index}>
                                            {interview.interviewer && (
                                              <div>
                                                <dt>인터뷰어</dt>
                                                <dd>{interview.interviewer}</dd>
                                              </div>
                                            )}
                                            {interview.interviewee && (
                                              <div>
                                                <dt>인터뷰이</dt>
                                                <dd>{interview.interviewee}</dd>
                                              </div>
                                            )}
                                          </React.Fragment>
                                        ))}
                                    </dl>
                                  )}
                                </div>
                              </div>
                              <Background color={banner.color} ltr={banner.isLTR} />
                            </Anchor>
                          )}
                        </div>
                      ))}
                </Slider>
                <button
                  type="button"
                  className={`${styles.prev} ${styles.move}`}
                  onClick={() => sliderRef.current?.slickPrev()}
                >
                  <PrevIcon />
                  <span>이전으로 이동</span>
                </button>
                <button
                  type="button"
                  className={`${styles.next} ${styles.move}`}
                  onClick={() => sliderRef.current?.slickNext()}
                >
                  <NextIcon />
                  <span>다음으로 이동</span>
                </button>
                <div className={styles.paging}>
                  <button type="button" className={styles.stat} onClick={toggleAutoplay}>
                    {isPlaying ? (
                      <>
                        <PauseIcon />
                        <span>일시멈춤</span>
                      </>
                    ) : (
                      <>
                        <PlayIcon />
                        <span>재생</span>
                      </>
                    )}
                  </button>
                  {banner.map((_: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      className={`${styles.pager} ${currentSlide === index ? styles.active : ''}`}
                      onClick={() => sliderRef.current?.slickGoTo(index)}
                    >
                      <i />
                      <span>{index + 1}번째</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
              {!interviewLoading ? (
                <>
                  {interviewData && Array.isArray(interviewData.articles) && (
                    <div className={styles['article-list']}>
                      {interviewData.articles.map((article: NewsData) => (
                        <article key={article.idx}>
                          <Link key={article.idx} href={`/interview/${article.idx}`} scroll={true} shallow={true}>
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
                </>
              ) : (
                <div className={styles['article-list']}>
                  <LoadingIndicator isInterview={true} />
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
              {!newsicLoading ? (
                <>
                  {newsicData && Array.isArray(newsicData.articles) && (
                    <div className={styles['article-list']}>
                      {newsicData.articles.map((article: NewsData) => (
                        <article key={article.idx}>
                          <Link key={article.idx} href={`/interview/${article.idx}`} scroll={true} shallow={true}>
                            {article.platform === 'youtube' ? (
                              <img src={`https://i.ytimg.com/vi_webp/${article.vid}/maxresdefault.webp`} alt="" />
                            ) : (
                              <img src={`https://cdn.dev1stud.io/nol2tr/${article.opengraph}.webp`} alt="" />
                            )}
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
                    </div>
                  )}
                </>
              ) : (
                <div className={styles['article-list']}>
                  <LoadingIndicator isInterview={false} />
                </div>
              )}
            </section>
            <section>
              <div className={styles.headline}>
                <Headline>
                  <Anchor href="/playlists">
                    <i data-page="/playlists" />
                    <span>Latest Playlist</span>
                  </Anchor>
                </Headline>
                <Anchor href="/playlists">
                  <MoreIcon />
                  <span>더 보기</span>
                </Anchor>
              </div>
              {!playlistLoading ? (
                <>
                  {playlistData && Array.isArray(playlistData.articles) && (
                    <div className={styles['article-list']}>
                      {playlistData.articles.map((article: NewsData) => (
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
                    </div>
                  )}
                </>
              ) : (
                <div className={styles['article-list']}>
                  <LoadingIndicator isInterview={false} />
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let banner = null;
  let bannerError = null;

  try {
    const bannerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banner`);
    if (!bannerResponse.ok) {
      throw new Error('Network response was not ok');
    }
    banner = await bannerResponse.json();
  } catch (err) {
    bannerError = err instanceof Error ? err.message : 'An unknown error occurred';
  }
  return {
    props: {
      banner,
      bannerError,
    },
  };
};
