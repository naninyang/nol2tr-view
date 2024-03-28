import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styled from '@emotion/styled';
import { useMediaQuery } from 'react-responsive';
import { MusicData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import YouTubeController from '@/components/YouTubeController';
import { rem } from '@/styles/designSystem';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Pages.module.sass';
import musicStyles from '@/styles/Music.module.sass';
import 'react-perfect-scrollbar/dist/css/styles.css';

type MusicDetailProps = {
  music: MusicData;
  onClose: () => void;
};

export function useTablet() {
  const [isTablet, setIsTablet] = useState(false);
  const tablet = useMediaQuery({ query: `(min-width: ${rem(768)}) and (max-width: ${rem(992)}` });
  useEffect(() => {
    setIsTablet(tablet);
  }, [tablet]);
  return isTablet;
}

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ query: `(max-width: ${rem(767)}` });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);
  return isMobile;
}

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

const YTmusicIcon = styled.i({
  background: `url(${images.misc.music}) no-repeat 50% 50%/contain`,
});

const CloseIcon = styled.i({
  background: `url(${images.arrow.crossDark}) no-repeat 50% 50%/contain`,
});

const MusicDetail: React.FC<MusicDetailProps> = ({ music, onClose }) => {
  const [infoVisible, setInfoVisible] = useState<boolean>(true);
  const [infoText, setInfoText] = useState<string>('정보 숨기기');
  const [lyricsVisible, setLyricsVisible] = useState<boolean>(true);
  const [lyricsText, setLyricsText] = useState<string>('가사 숨기기');

  const toggleInfo = () => {
    if (infoVisible) {
      setInfoVisible(false);
      setInfoText('정보 보기');
    } else {
      setInfoVisible(true);
      setInfoText('정보 숨기기');
    }
  };

  const toggleLyrics = () => {
    if (lyricsVisible) {
      setLyricsVisible(false);
      setLyricsText('가사 보기');
    } else {
      setLyricsVisible(true);
      setLyricsText('가사 숨기기');
    }
  };

  const isTablet = useTablet();
  const isMobile = useMobile();

  return (
    <dialog
      className={`${musicStyles.dialog} ${music.isMV ? musicStyles.mv : ''} ${
        music.instrument ? musicStyles.instrument : ''
      } ${isTablet ? musicStyles.tablet : ''} ${isMobile && music.isMV === false ? musicStyles.onlyMusic : ''}`}
    >
      <div className={musicStyles.container}>
        <button type="button" onClick={onClose}>
          <CloseIcon />
          <span>닫기</span>
        </button>
        <Anchor href={`https://music.youtube.com/watch?v=${music.videoid}`}>
          <YTmusicIcon />
          <span>YouTube Music</span>에서 고음질로 듣기
        </Anchor>
        {isTablet && music.lyrics !== null ? (
          <>
            <div className={musicStyles.info}>
              <div className={musicStyles.yt}>
                <YouTubeController videoId={music.videoid} start={music.start} vi={music.vvi} mv={music.isMV} />
              </div>
              <div className={musicStyles.summary}>
                <h2>{music.music}</h2>
                <cite>
                  {music.instrument ? (
                    <>{music.artist !== null ? music.artist : music.composer}</>
                  ) : music.cover !== null ? (
                    <>
                      {music.cover} 커버 ({music.artist} 원곡)
                    </>
                  ) : (
                    music.artist
                  )}
                </cite>
                <dl>
                  {music.cover !== null && (
                    <div>
                      <dt>원곡</dt>
                      <dd>{music.artist}</dd>
                    </div>
                  )}
                  <div>
                    <dt>수록앨범</dt>
                    <dd>{music.album}</dd>
                  </div>
                  {music.composer === music.lyricist ? (
                    <div>
                      <dt>작곡/작사</dt>
                      <dd>{music.composer}</dd>
                    </div>
                  ) : (
                    <>
                      <div>
                        <dt>작곡</dt>
                        <dd>{music.composer}</dd>
                      </div>
                      {music.lyricist !== null && (
                        <div>
                          <dt>작사</dt>
                          <dd>{music.lyricist}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
              </div>
            </div>
            <div className={musicStyles.lyrics}>
              <PerfectScrollbar className={styles['scrollbar-container']}>
                <p dangerouslySetInnerHTML={{ __html: music.lyrics.replace(/\n/g, '<br />') }} />
              </PerfectScrollbar>
            </div>
          </>
        ) : isMobile && music.isMV === false ? (
          <>
            <div className={musicStyles.info}>
              <div className={musicStyles.yt}>
                <YouTubeController videoId={music.videoid} start={music.start} vi={music.vvi} mv={music.isMV} />
              </div>
              <div className={musicStyles.summary}>
                <h2>{music.music}</h2>
                <cite>
                  {music.instrument ? (
                    <>{music.artist !== null ? music.artist : music.composer}</>
                  ) : music.cover !== null ? (
                    <>
                      {music.cover} 커버 ({music.artist} 원곡)
                    </>
                  ) : (
                    music.artist
                  )}
                </cite>
                <dl>
                  {music.cover !== null && (
                    <div>
                      <dt>원곡</dt>
                      <dd>{music.artist}</dd>
                    </div>
                  )}
                  <div>
                    <dt>수록앨범</dt>
                    <dd>{music.album}</dd>
                  </div>
                  {music.composer === music.lyricist ? (
                    <div>
                      <dt>작곡/작사</dt>
                      <dd>{music.composer}</dd>
                    </div>
                  ) : (
                    <>
                      <div>
                        <dt>작곡</dt>
                        <dd>{music.composer}</dd>
                      </div>
                      {music.lyricist !== null && (
                        <div>
                          <dt>작사</dt>
                          <dd>{music.lyricist}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
              </div>
            </div>
            {music.lyrics !== null && (
              <div className={musicStyles.lyrics}>
                <PerfectScrollbar className={styles['scrollbar-container']}>
                  <p dangerouslySetInnerHTML={{ __html: music.lyrics.replace(/\n/g, '<br />') }} />
                </PerfectScrollbar>
              </div>
            )}
          </>
        ) : (
          <>
            <div className={musicStyles.info}>
              {music.lyrics === null && (
                <div className={musicStyles.summary}>
                  <h2>{music.music}</h2>
                  <cite>
                    {music.instrument ? (
                      <>{music.artist !== null ? music.artist : music.composer}</>
                    ) : music.cover !== null ? (
                      <>
                        {music.cover} 커버 ({music.artist} 원곡)
                      </>
                    ) : (
                      music.artist
                    )}
                  </cite>
                  <dl>
                    {music.cover !== null && (
                      <div>
                        <dt>원곡</dt>
                        <dd>{music.artist}</dd>
                      </div>
                    )}
                    <div>
                      <dt>수록앨범</dt>
                      <dd>{music.album}</dd>
                    </div>
                    {music.composer === music.lyricist ? (
                      <div>
                        <dt>작곡/작사</dt>
                        <dd>{music.composer}</dd>
                      </div>
                    ) : (
                      <>
                        <div>
                          <dt>작곡</dt>
                          <dd>{music.composer}</dd>
                        </div>
                        {music.lyricist !== null && (
                          <div>
                            <dt>작사</dt>
                            <dd>{music.lyricist}</dd>
                          </div>
                        )}
                      </>
                    )}
                  </dl>
                </div>
              )}
              <div className={musicStyles.yt}>
                <YouTubeController videoId={music.videoid} start={music.start} vi={music.vvi} mv={music.isMV} />
              </div>
            </div>
            {music.lyrics !== null && (
              <div className={musicStyles.lyrics}>
                <div className={musicStyles.summary}>
                  <h2>{music.music}</h2>
                  <cite>
                    {music.instrument ? (
                      <>{music.artist !== null ? music.artist : music.composer}</>
                    ) : music.cover !== null ? (
                      <>
                        {music.cover} 커버 ({music.artist} 원곡)
                      </>
                    ) : (
                      music.artist
                    )}
                    <button type="button" onClick={toggleInfo}>
                      {infoText}
                    </button>
                    {music.isCC && (
                      <button type="button" onClick={toggleLyrics}>
                        {lyricsText}
                      </button>
                    )}
                  </cite>
                </div>
                <dl className={infoVisible ? '' : musicStyles.hidden}>
                  {music.cover !== null && (
                    <div>
                      <dt>원곡</dt>
                      <dd>{music.artist}</dd>
                    </div>
                  )}
                  <div>
                    <dt>수록앨범</dt>
                    <dd>{music.album}</dd>
                  </div>
                  {music.composer === music.lyricist ? (
                    <div>
                      <dt>작곡/작사</dt>
                      <dd>{music.composer}</dd>
                    </div>
                  ) : (
                    <>
                      <div>
                        <dt>작곡</dt>
                        <dd>{music.composer}</dd>
                      </div>
                      {music.lyricist !== null && (
                        <div>
                          <dt>작사</dt>
                          <dd>{music.lyricist}</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
                <PerfectScrollbar className={styles['scrollbar-container']}>
                  <p
                    dangerouslySetInnerHTML={{ __html: music.lyrics.replace(/\n/g, '<br />') }}
                    className={lyricsVisible ? '' : musicStyles.hidden}
                  />
                </PerfectScrollbar>
              </div>
            )}
          </>
        )}
      </div>
    </dialog>
  );
};

const Musics = ({ musicsData }: { musicsData: MusicData[] }) => {
  const router = useRouter();
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);

  const handleButtonClick = (id: string) => {
    setSelectedMusicId(id);
  };

  const handleCloseMusicDetail = () => {
    setSelectedMusicId(null);
  };

  const selectedMusic = musicsData.find((music) => music.id === selectedMusicId);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    if (selectedMusic !== undefined) {
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
  }, [selectedMusic]);

  const previousPageHandler = () => {
    const previousPage = sessionStorage.getItem('location');
    if (previousPage) {
      router.push(`${previousPage}`);
    } else {
      router.push('/');
    }
  };

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.pages} ${styles.music} ${musicStyles.music}`}>
      <Seo
        pageTitles={`선곡표 - ${originTitle}`}
        pageTitle="선곡표"
        pageDescription="놀이터뷰 선곡표"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className="top-link">
        <button onClick={previousPageHandler} type="button">
          <BackButton />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className={styles['pages-content']}>
        <h1>
          <span>선곡표 music_table</span>
        </h1>
        <div>
          <p>🎶 놀이터뷰에서 선곡한 곡 목록입니다 🎵</p>
          <p>👉 곡은 가나다 순으로 정렬됩니다 👉</p>
        </div>
        <div className={musicStyles.musics}>
          <ul>
            {musicsData.map((music) => (
              <li key={music.id}>
                <button type="button" onClick={() => handleButtonClick(music.id)}>
                  <Image
                    src={`https://cdn.dev1stud.io/nol2tr/_/${music.videoid}.webp`}
                    width={360}
                    height={360}
                    alt=""
                    unoptimized
                  />
                  <span>
                    <strong>{music.music}</strong>
                    <cite>
                      {music.instrument
                        ? music.artist !== null
                          ? music.artist
                          : music.composer
                        : music.cover !== null
                        ? music.cover
                        : music.artist}
                    </cite>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedMusicId && selectedMusic && <MusicDetail music={selectedMusic} onClose={handleCloseMusicDetail} />}
    </main>
  );
};

export default Musics;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let mergedData: MusicData[] = [];
    let page = 1;
    let isTotalSet = false;
    let total = 0;

    do {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/musics?page=${page}`);
      const data = await response.json();

      if (!isTotalSet) {
        total = data.total;
        isTotalSet = true;
      }

      if (data.rowsData.length === 0) {
        break;
      } else {
        mergedData = mergedData.concat(data.rowsData);
        page++;
      }
    } while (mergedData.length < total);

    const sortedData = mergedData.sort((a, b) => {
      if (a.music < b.music) return -1;
      if (a.music > b.music) return 1;
      return 0;
    });

    return {
      props: {
        musicsData: sortedData,
      },
    };
  } catch (error) {
    console.error('서버 사이드에서 데이터 가져오기 실패:', error);
    return {
      props: {
        musicsData: [],
      },
    };
  }
};
