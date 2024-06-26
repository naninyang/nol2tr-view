import { useCallback, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { isIOS } from 'react-device-detect';
import PerfectScrollbar from 'react-perfect-scrollbar';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';
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

interface PlayerProps {
  currentSong: MusicData;
  onEnd: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isLooping: boolean;
  toggleLoop: () => void;
  handlePlayPauseClick: (play: boolean, fromButton: boolean) => void;
  isPlaying: boolean;
  onReady: (event: YouTubeEvent<any>) => void;
  onSeek: (time: number) => void;
}

const PlayIcon = styled.i({
  background: `url(${images.misc.play}) no-repeat 50% 50%/contain`,
});

const PauseIcon = styled.i({
  background: `url(${images.misc.pause}) no-repeat 50% 50%/contain`,
});

const PrevIcon = styled.i({
  background: `url(${images.misc.prev}) no-repeat 50% 50%/contain`,
});

const NextIcon = styled.i({
  background: `url(${images.misc.next}) no-repeat 50% 50%/contain`,
});

const RepeatIcon = styled.i({
  background: `url(${images.misc.repeat}) no-repeat 50% 50%/contain`,
});

const RepeatingIcon = styled.i({
  background: `url(${images.misc.repeating}) no-repeat 50% 50%/contain`,
});

const SelectIcon = styled.i({
  background: `url(${images.misc.select}) no-repeat 50% 50%/contain`,
});

const UnselectIcon = styled.i({
  background: `url(${images.misc.unselect}) no-repeat 50% 50%/contain`,
});

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
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.crossLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.crossDark}) no-repeat 50% 50%/contain`,
  },
});

const WarningIcon = styled.i({
  background: `url(${images.misc.warning}) no-repeat 50% 50%/contain`,
});

const LoadingIndicator = ({ length }: { length: number }) => {
  const loadingBlocks = Array.from({ length: length }, (_, index) => index);
  return (
    <>
      {loadingBlocks.map((_, index) => (
        <li key={index} className={musicStyles['loading-indicator']} aria-hidden="true">
          <div className={musicStyles.button}>
            <i className={musicStyles.skeleton} />
            <span>
              <strong className={musicStyles.skeleton} />
              <cite className={musicStyles.skeleton} />
            </span>
          </div>
        </li>
      ))}
    </>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const Player: React.FC<PlayerProps> = ({
  currentSong,
  onEnd,
  onPrevious,
  onNext,
  isLooping,
  toggleLoop,
  handlePlayPauseClick,
  isPlaying,
  onReady,
  onSeek,
}) => {
  const opts: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1 as 0 | 1 | undefined,
    },
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<any>(null);

  const updateCurrentTimeAndDuration = useCallback(() => {
    if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      setCurrentTime(currentTime);
      setDuration(duration);
    } else {
      console.log('Player is not ready');
    }
  }, [playerRef]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentTimeAndDuration();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateCurrentTimeAndDuration]);

  const handleSeekBarClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    onSeek(newTime);
  };

  return (
    <div className={musicStyles['player-bar']}>
      <div tabIndex={-1} className={musicStyles.hidden}>
        <YouTube
          videoId={currentSong.videoid}
          opts={opts}
          onReady={(event) => {
            onReady(event);
            playerRef.current = event.target;
            updateCurrentTimeAndDuration();
          }}
          onEnd={onEnd}
          onStateChange={(event: YouTubeEvent<any>) => {
            if (event.data === 1) {
              handlePlayPauseClick(true, false);
            } else if (event.data === 2) {
              handlePlayPauseClick(false, false);
            } else if (event.data === 0) {
              onEnd();
            }
          }}
        />
      </div>
      <div className={musicStyles.player}>
        <button type="button" className={musicStyles.seekbar} onClick={handleSeekBarClick}>
          <span
            style={{
              width: `${(currentTime / duration) * 100}%`,
            }}
          />
          <em
            style={{
              left: `calc(${(currentTime / duration) * 100}% - ${rem(6)})`,
            }}
          >
            <i>{formatTime(currentTime)}</i>
          </em>
        </button>
        <div className={musicStyles.duration}>{formatTime(duration)}</div>
        <div className={musicStyles.song}>
          <div className={musicStyles.cover}>
            <Image
              src={`https://cdn.dev1stud.io/nol2tr/_/${currentSong.videoid}.webp`}
              width={47}
              height={47}
              alt=""
              unoptimized
            />
          </div>
          <div className={musicStyles.info}>
            <strong>
              {currentSong.music} <span>재생 중</span>
            </strong>
            <cite>
              {currentSong.instrument
                ? currentSong.artist !== null
                  ? currentSong.artist
                  : currentSong.composer
                : currentSong.cover !== null
                ? currentSong.cover
                : currentSong.artist}
            </cite>
          </div>
        </div>
        <div className={musicStyles.play}>
          <button className={musicStyles['skip-button']} type="button" onClick={onPrevious}>
            <PrevIcon />
            <span>이전곡 재생</span>
          </button>
          <button
            className={musicStyles['play-button']}
            type="button"
            onClick={() => handlePlayPauseClick(!isPlaying, true)}
          >
            {isPlaying ? (
              <>
                <PauseIcon />
                <span>일시중지 하기</span>
              </>
            ) : (
              <>
                <PlayIcon />
                <span>계속재생 하기</span>
              </>
            )}
          </button>
          <button className={musicStyles['skip-button']} type="button" onClick={onNext}>
            <NextIcon />
            <span>다음곡 재생</span>
          </button>
        </div>
        <div className={musicStyles.repeat}>
          <button onClick={toggleLoop}>
            {isLooping ? (
              <>
                <RepeatingIcon />
                <span>한곡 반복 중</span>
              </>
            ) : (
              <>
                <RepeatIcon />
                <span>전체 곡 반복 중</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const MusicDetail: React.FC<MusicDetailProps> = ({ music, onClose }) => {
  const [infoVisible, setInfoVisible] = useState<boolean>(false);
  const [infoText, setInfoText] = useState<string>('정보 보기');
  const [lyricsVisible, setLyricsVisible] = useState<boolean>(false);
  const [lyricsText, setLyricsText] = useState<string>('가사 보기');

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

  const ReportVideo = ({ videoId }: { videoId: string }) => {
    const handleReport = async (event: React.MouseEvent<HTMLButtonElement>) => {
      const jejeupVideo = event.currentTarget.getAttribute('data-video');

      try {
        const response = await fetch('/api/unpublish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ jejeupVideo: jejeupVideo }),
        });

        if (response.ok) {
          alert('신고 성공! 감사합니다 ☺️');
        } else {
          const errorData = await response.json();
          console.log(errorData.error);
          alert('서버 오류입니다. 잠시 뒤 다시 시도해 주세요 😭');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('서버 오류입니다. 잠시 뒤 다시 시도해 주세요 😭');
      }
    };

    return (
      <p className={musicStyles['report-video']}>
        <WarningIcon />
        유튜브 영상에 문제가 있을 때는{' '}
        <button type="button" onClick={handleReport} data-video={videoId}>
          제보
        </button>
        해 주세요. 알려주시면 문제가 없는 영상으로 교체합니다.
      </p>
    );
  };

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
              <ReportVideo videoId={music.videoid} />
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
                <ReportVideo videoId={music.videoid} />
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
                  <ReportVideo videoId={music.videoid} />
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
                <ReportVideo videoId={music.videoid} />
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

const Musics = ({ musicTotal, musicError }: { musicTotal: number; musicError: string }) => {
  const router = useRouter();
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  const [musicsData, setMusicsData] = useState<MusicData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ios, setIos] = useState<string>();
  useEffect(() => {
    if (isIOS) {
      setIos('isIOS');
    }
  }, []);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        let mergedData: MusicData[] = [];
        let page = 1;
        let isTotalSet = false;
        let total = 0;

        do {
          const response = await fetch(`/api/musics?page=${page}`);
          const data: { total: number; rowsData: MusicData[] } = await response.json();

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

        setMusicsData(sortedData);
      } catch (error) {
        console.error('API 서버 오류', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicData();
  }, []);

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

  function MusicItem({ music }: { music: any }) {
    return (
      <>
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
      </>
    );
  }

  function SongItem({ music }: { music: any }) {
    return (
      <>
        <button type="button" onClick={() => handleSongClick(music.id)}>
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
      </>
    );
  }

  const [playMode, setPlayMode] = useState<'one' | 'all'>('one');
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<any>(null);

  const handleSongClick = (id: string) => {
    setCurrentSongId(id);
    setIsPlaying(true);
  };

  const handleEnd = () => {
    if (isLooping) {
      playerRef.current.playVideo();
    } else if (playMode === 'one') {
      // do nothing
    } else {
      handleNext();
    }
  };

  const handlePrevious = () => {
    if (currentSongId !== null) {
      const currentIndex = musicsData.findIndex((music) => music.id === currentSongId);
      const newIndex = (currentIndex - 1 + musicsData.length) % musicsData.length;
      setCurrentSongId(musicsData[newIndex].id);
      if (playerRef.current) {
        playerRef.current.loadVideoById(musicsData[newIndex].videoid);
      }
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentSongId !== null) {
      const currentIndex = musicsData.findIndex((music) => music.id === currentSongId);
      const newIndex = (currentIndex + 1) % musicsData.length;
      setCurrentSongId(musicsData[newIndex].id);
      if (playerRef.current) {
        playerRef.current.loadVideoById(musicsData[newIndex].videoid);
      }
      setIsPlaying(true);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const onReady = (event: YouTubeEvent<any>) => {
    playerRef.current = event.target;
    if (currentSongId) {
      const currentSong = musicsData.find((music) => music.id === currentSongId);
      if (currentSong) {
        playerRef.current.loadVideoById(currentSong.videoid);
      }
    }
  };

  const handlePlayPauseClick = (play: boolean, fromButton: boolean) => {
    if (playerRef.current) {
      if (play) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
      if (fromButton) {
        setIsPlaying(play);
      }
    }
  };

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  const timestamp = Date.now();

  return (
    <main
      className={`${content.content} ${styles.pages} ${styles.music} ${musicStyles.music} ${
        currentSongId !== null ? musicStyles.mpb : ''
      }`}
    >
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
          {musicError ? (
            <p>API 서버에 오류가 있습니다. 잠시 후 이용해 주세요.</p>
          ) : (
            <>
              {ios !== 'isIOS' && (
                <>
                  <div className={`${musicStyles.control} ${playMode === 'all' ? musicStyles.all : ''}`}>
                    <label>
                      <input
                        type="radio"
                        value="one"
                        checked={playMode === 'one'}
                        onChange={() => setPlayMode('one')}
                      />
                      {playMode === 'one' ? (
                        <>
                          <SelectIcon />
                          <strong>한곡 재생</strong>
                        </>
                      ) : (
                        <>
                          <UnselectIcon />
                          <span>한곡 재생</span>
                        </>
                      )}
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="all"
                        checked={playMode === 'all'}
                        onChange={() => setPlayMode('all')}
                      />
                      {playMode === 'one' ? (
                        <>
                          <UnselectIcon />
                          <span>전곡 재생</span>
                        </>
                      ) : (
                        <>
                          <SelectIcon />
                          <strong>전곡 재생</strong>
                        </>
                      )}
                    </label>
                  </div>
                  {playMode === 'all' && <p>전곡 재생 선택시 곡을 누르면 자동으로 재생됩니다.</p>}
                </>
              )}
            </>
          )}
        </div>
        {!musicError && (
          <div className={`${musicStyles.musics} ${loading ? musicStyles.loading : ''}`}>
            {!loading ? (
              <ul>
                {playMode === 'one' ? (
                  <>
                    {musicsData.map((music) => (
                      <li key={music.id}>
                        <MusicItem music={music} />
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {musicsData.map((music) => (
                      <li key={music.id}>
                        <SongItem music={music} />
                      </li>
                    ))}
                  </>
                )}
              </ul>
            ) : (
              <ul>
                <LoadingIndicator length={musicTotal} />
              </ul>
            )}
          </div>
        )}
      </div>
      {selectedMusicId && selectedMusic && <MusicDetail music={selectedMusic} onClose={handleCloseMusicDetail} />}
      {currentSongId !== null && (
        <Player
          currentSong={musicsData.find((music) => music.id === currentSongId)!}
          onEnd={handleEnd}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isLooping={isLooping}
          toggleLoop={toggleLoop}
          handlePlayPauseClick={handlePlayPauseClick}
          isPlaying={isPlaying}
          onReady={onReady}
          onSeek={handleSeek}
        />
      )}
    </main>
  );
};

export default Musics;

export const getServerSideProps: GetServerSideProps = async () => {
  let musicData = null;
  let musicTotal = null;
  let musicError = null;

  try {
    const music = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/musics?page=1&pageSize=1`);
    if (!music.ok) {
      throw new Error('Network response was not ok');
    }
    musicData = await music.json();
    musicTotal = musicData.total;
  } catch (err) {
    musicError = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return {
    props: {
      musicTotal,
      musicError,
    },
  };
};
