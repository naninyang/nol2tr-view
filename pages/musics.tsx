import { useCallback, useEffect, useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { isIOS, isSafari } from 'react-device-detect';
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
  onPrevious: () => void;
  onNext: () => void;
  isLooping: boolean;
  toggleLoop: () => void;
  isLyrics: boolean;
  toggleLyrics: () => void;
  handlePlayPauseClick: (play: boolean, fromButton: boolean) => void;
  isPlaying: boolean;
  playMode: string;
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

const DownIcon = styled.i({
  background: `url(${images.arrow.downLight}) no-repeat 50% 50%/contain`,
});

const LyricsDisabledIcon = styled.i({
  background: `url(${images.misc.lyricsDisabled}) no-repeat 50% 50%/contain`,
});

const LyricsEnabledIcon = styled.i({
  background: `url(${images.misc.lyricsEnabled}) no-repeat 50% 50%/contain`,
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

export function useLandscape() {
  const [isLandscape, setIsLandscape] = useState(false);
  const landscape = useMediaQuery({ query: `(min-aspect-ratio: 1/1)` });
  useEffect(() => {
    setIsLandscape(landscape);
  }, [landscape]);
  return isLandscape;
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
  onPrevious,
  onNext,
  isLooping,
  toggleLoop,
  isLyrics,
  toggleLyrics,
  handlePlayPauseClick,
  isPlaying,
  playMode,
  onReady,
  onSeek,
}) => {
  const opts: YouTubeProps['opts'] = {
    width: 1920,
    height: 1080,
    playerVars: {
      autoplay: 1 as 0 | 1 | undefined,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      disablekb: 0,
      iv_load_policy: 3,
      start: currentSong.start,
    },
  };

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef1 = useRef<any>(null);
  const playerRef2 = useRef<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isYouTube, setIsYouTube] = useState(false);
  const isLandscape = useLandscape();
  const [safari, setSafari] = useState<string>();
  useEffect(() => {
    if (isSafari) {
      setSafari('isSafari');
    }
  }, []);

  const updateCurrentTimeAndDuration = useCallback(() => {
    if (playerRef1.current && playerRef1.current.getCurrentTime && playerRef1.current.getDuration) {
      const currentTime = playerRef1.current.getCurrentTime();
      const duration = playerRef1.current.getDuration();
      setCurrentTime(currentTime);
      setDuration(duration);
    }

    if (playerRef2.current && playerRef2.current.getCurrentTime && playerRef2.current.getDuration) {
      const currentTime = playerRef2.current.getCurrentTime();
      const duration = playerRef2.current.getDuration();
      setCurrentTime(currentTime);
      setDuration(duration);
    }
  }, [playerRef1, playerRef2]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentTimeAndDuration();
    }, 1000);

    return () => clearInterval(interval);
  }, [updateCurrentTimeAndDuration]);

  const handleEnd = () => {
    if (isLooping) {
      if (playerRef1.current) playerRef1.current.seekTo(0);
      if (playerRef2.current) playerRef2.current.seekTo(0);
      setCurrentTime(0);
      playerRef1.current.playVideo();
      playerRef2.current.playVideo();
    } else if (playMode === 'all') {
      onNext();
    }
  };

  const handleSeekBarClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!playerRef1.current || !playerRef2.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    playerRef1.current.seekTo(newTime);
    playerRef2.current.seekTo(newTime);
    onSeek(newTime);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      if (playerRef1.current) playerRef1.current.pauseVideo();
      if (playerRef2.current) playerRef2.current.pauseVideo();
    } else {
      if (playerRef1.current) playerRef1.current.playVideo();
      if (playerRef2.current) playerRef2.current.playVideo();
    }
    handlePlayPauseClick(!isPlaying, true);
  };

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    if (showPlayer) {
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
  }, [showPlayer]);

  return (
    <div className={`${musicStyles['player-bar']} ${safari === 'isSafari' ? musicStyles.isSafari : ''}`}>
      <div
        tabIndex={showPlayer ? undefined : -1}
        aria-hidden={showPlayer ? undefined : 'true'}
        className={`${showPlayer ? musicStyles.show : musicStyles.hidden} ${
          !isLandscape && showPlayer ? musicStyles.portrait : ''
        }`}
      >
        <div className={musicStyles['player-close']}>
          <button onClick={() => setShowPlayer(false)} type="button">
            <DownIcon />
            <span>플레이어 숨기기</span>
          </button>
        </div>
        {isLandscape && currentSong.lyrics && (
          <div className={musicStyles.lyrics}>
            <PerfectScrollbar className={styles['scrollbar-container']}>
              <p dangerouslySetInnerHTML={{ __html: currentSong.lyrics.replace(/\n/g, '<br />') }} />
            </PerfectScrollbar>
          </div>
        )}
        <div className={`${musicStyles.cover} ${isYouTube && currentSong.isMV ? musicStyles.YouTube : ''}`}>
          {currentSong.isMV ? (
            <>
              {isYouTube ? (
                <div className={musicStyles.background}>
                  <YouTube
                    videoId={currentSong.videoid}
                    opts={opts}
                    onReady={(event) => {
                      onReady(event);
                      playerRef2.current = event.target;
                      updateCurrentTimeAndDuration();
                      playerRef2.current.mute();
                    }}
                    onStateChange={(event: YouTubeEvent<any>) => {
                      if (event.data === 1) {
                        handlePlayPauseClick(true, false);
                      } else if (event.data === 2) {
                        handlePlayPauseClick(false, false);
                      } else if (event.data === 0) {
                        handleEnd();
                      }
                    }}
                  />
                  <div className={musicStyles.dummy} />
                </div>
              ) : (
                <div className={musicStyles.background}>
                  <Image
                    src={`https://cdn.dev1stud.io/nol2tr/_/${currentSong.videoid}.webp`}
                    width={47}
                    height={47}
                    alt=""
                    unoptimized
                  />
                  <YouTube
                    videoId={currentSong.videoid}
                    opts={opts}
                    onReady={(event) => {
                      onReady(event);
                      playerRef2.current = event.target;
                      updateCurrentTimeAndDuration();
                      playerRef2.current.mute();
                    }}
                    onStateChange={(event: YouTubeEvent<any>) => {
                      if (event.data === 1) {
                        handlePlayPauseClick(true, false);
                      } else if (event.data === 2) {
                        handlePlayPauseClick(false, false);
                      } else if (event.data === 0) {
                        handleEnd();
                      }
                    }}
                  />
                  <div className={musicStyles.dummy} />
                </div>
              )}
            </>
          ) : (
            <div className={musicStyles.background}>
              <Image
                src={`https://cdn.dev1stud.io/nol2tr/_/${currentSong.videoid}.webp`}
                width={47}
                height={47}
                alt=""
                unoptimized
              />
              <YouTube
                videoId={currentSong.videoid}
                opts={opts}
                onReady={(event) => {
                  onReady(event);
                  playerRef2.current = event.target;
                  updateCurrentTimeAndDuration();
                  playerRef2.current.mute();
                }}
                onStateChange={(event: YouTubeEvent<any>) => {
                  if (event.data === 1) {
                    handlePlayPauseClick(true, false);
                  } else if (event.data === 2) {
                    handlePlayPauseClick(false, false);
                  } else if (event.data === 0) {
                    handleEnd();
                  }
                }}
              />
              <div className={musicStyles.dummy} />
            </div>
          )}
          {currentSong.isMV && (
            <div className={musicStyles.switching}>
              <ul>
                <li>
                  <button
                    onClick={() => setIsYouTube(false)}
                    className={`${isYouTube ? '' : musicStyles.current} ${musicStyles.isNotYouTube}`}
                    type="button"
                  >
                    노래
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsYouTube(true)}
                    className={`${isYouTube ? musicStyles.current : ''} ${musicStyles.isYouTube}`}
                    type="button"
                  >
                    동영상
                  </button>
                </li>
              </ul>
            </div>
          )}
          {currentSong.isMV ? (
            <>
              {isYouTube ? (
                <div className={musicStyles.youtube}>
                  <div className={musicStyles['youtube-wrapper']}>
                    <YouTube
                      videoId={currentSong.videoid}
                      opts={opts}
                      onReady={(event) => {
                        onReady(event);
                        playerRef1.current = event.target;
                        updateCurrentTimeAndDuration();
                      }}
                      onStateChange={(event: YouTubeEvent<any>) => {
                        if (event.data === 1) {
                          handlePlayPauseClick(true, false);
                        } else if (event.data === 2) {
                          handlePlayPauseClick(false, false);
                        } else if (event.data === 0) {
                          handleEnd();
                        }
                      }}
                    />
                    {isPlaying ? (
                      <div className={musicStyles.dummy}>
                        <button type="button" onClick={handlePlayPause}>
                          <em>
                            <PauseIcon />
                          </em>
                          <span>영상 재생하기</span>
                        </button>
                      </div>
                    ) : (
                      <div className={musicStyles.thumbnail}>
                        <Image
                          src={`https://i.ytimg.com/vi/${currentSong.videoid}/${currentSong.vvi}.jpg`}
                          width={640}
                          height={480}
                          unoptimized
                          priority
                          alt=""
                        />
                        <button type="button" onClick={handlePlayPause}>
                          <em>
                            <PlayIcon />
                          </em>
                          <span>영상 재생하기</span>
                        </button>
                      </div>
                    )}
                  </div>
                  {isLandscape ? (
                    <div className={musicStyles.summary}>
                      <h2>{currentSong.music}</h2>
                      <cite>
                        {currentSong.instrument ? (
                          <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                        ) : currentSong.cover !== null ? (
                          <>
                            {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                          </>
                        ) : (
                          currentSong.artist
                        )}
                      </cite>
                      <dl>
                        {currentSong.cover !== null && (
                          <div>
                            <dt>원곡</dt>
                            <dd>{currentSong.artist}</dd>
                          </div>
                        )}
                        <div>
                          <dt>수록앨범</dt>
                          <dd>{currentSong.album}</dd>
                        </div>
                        {currentSong.composer === currentSong.lyricist ? (
                          <div>
                            <dt>작곡/작사</dt>
                            <dd>{currentSong.composer}</dd>
                          </div>
                        ) : (
                          <>
                            <div>
                              <dt>작곡</dt>
                              <dd>{currentSong.composer}</dd>
                            </div>
                            {currentSong.lyricist !== null && (
                              <div>
                                <dt>작사</dt>
                                <dd>{currentSong.lyricist}</dd>
                              </div>
                            )}
                          </>
                        )}
                      </dl>
                    </div>
                  ) : (
                    <div className={musicStyles.controller}>
                      <div className={musicStyles.summary}>
                        <h2>{currentSong.music}</h2>
                        <cite>
                          {currentSong.instrument ? (
                            <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                          ) : currentSong.cover !== null ? (
                            <>
                              {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                            </>
                          ) : (
                            currentSong.artist
                          )}
                        </cite>
                        <dl>
                          {currentSong.cover !== null && (
                            <div>
                              <dt>원곡</dt>
                              <dd>{currentSong.artist}</dd>
                            </div>
                          )}
                          <div>
                            <dt>수록앨범</dt>
                            <dd>{currentSong.album}</dd>
                          </div>
                          {currentSong.composer === currentSong.lyricist ? (
                            <div>
                              <dt>작곡/작사</dt>
                              <dd>{currentSong.composer}</dd>
                            </div>
                          ) : (
                            <>
                              <div>
                                <dt>작곡</dt>
                                <dd>{currentSong.composer}</dd>
                              </div>
                              {currentSong.lyricist !== null && (
                                <div>
                                  <dt>작사</dt>
                                  <dd>{currentSong.lyricist}</dd>
                                </div>
                              )}
                            </>
                          )}
                        </dl>
                      </div>
                      <button type="button" className={musicStyles.seekbar} onClick={handleSeekBarClick}>
                        <span
                          style={{
                            width: `${(currentTime / duration) * 100}%`,
                          }}
                        />
                        {duration !== undefined && duration > 0 && (
                          <>
                            {currentTime < duration - 1 && (
                              <em
                                style={{
                                  left: `calc(${(currentTime / duration) * 100}% - ${rem(6)})`,
                                }}
                                className={`${(currentTime / duration) * 100 < 5 ? musicStyles.left : ''} ${
                                  (currentTime / duration) * 100 > 95 ? musicStyles.right : ''
                                }`}
                              >
                                <i>{formatTime(currentTime)}</i>
                              </em>
                            )}
                          </>
                        )}
                      </button>
                      <div className={musicStyles.option}>
                        {duration !== undefined && duration > 0 && (
                          <div className={musicStyles.duration}>{formatTime(duration)}</div>
                        )}
                        <div style={{ width: rem(27) }} />
                        <div className={musicStyles.play}>
                          <button className={musicStyles['skip-button']} type="button" onClick={onPrevious}>
                            <PrevIcon />
                            <span>이전곡 재생</span>
                          </button>
                          <button className={musicStyles['play-button']} type="button" onClick={handlePlayPause}>
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
                          <button onClick={toggleLoop} type="button">
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
                  )}
                </div>
              ) : (
                <>
                  {!isLandscape && isLyrics && currentSong.lyrics && (
                    <div className={musicStyles['music-lyrics']}>
                      <div className={musicStyles['music-info']}>
                        <div className={musicStyles['song-cover']}>
                          <Image
                            src={`https://cdn.dev1stud.io/nol2tr/_/${currentSong.videoid}.webp`}
                            width={47}
                            height={47}
                            alt=""
                            unoptimized
                          />
                        </div>
                        <div className={musicStyles.summary}>
                          <h2>{currentSong.music}</h2>
                          <cite>
                            {currentSong.instrument ? (
                              <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                            ) : currentSong.cover !== null ? (
                              <>
                                {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                              </>
                            ) : (
                              currentSong.artist
                            )}
                          </cite>
                        </div>
                      </div>
                      <div className={musicStyles.lyrics}>
                        <PerfectScrollbar className={styles['scrollbar-container']}>
                          <p dangerouslySetInnerHTML={{ __html: currentSong.lyrics.replace(/\n/g, '<br />') }} />
                        </PerfectScrollbar>
                      </div>
                    </div>
                  )}
                  <div className={musicStyles.thumbnail}>
                    {(isLandscape || (!isLandscape && !isLyrics) || !currentSong.lyrics) && (
                      <div>
                        <Image
                          src={`https://cdn.dev1stud.io/nol2tr/-/${currentSong.videoid}.webp`}
                          width={720}
                          height={720}
                          alt=""
                          unoptimized
                        />
                      </div>
                    )}
                    {isLandscape ? (
                      <div className={musicStyles.summary}>
                        <h2>{currentSong.music}</h2>
                        <cite>
                          {currentSong.instrument ? (
                            <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                          ) : currentSong.cover !== null ? (
                            <>
                              {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                            </>
                          ) : (
                            currentSong.artist
                          )}
                        </cite>
                        <dl>
                          {currentSong.cover !== null && (
                            <div>
                              <dt>원곡</dt>
                              <dd>{currentSong.artist}</dd>
                            </div>
                          )}
                          <div>
                            <dt>수록앨범</dt>
                            <dd>{currentSong.album}</dd>
                          </div>
                          {currentSong.composer === currentSong.lyricist ? (
                            <div>
                              <dt>작곡/작사</dt>
                              <dd>{currentSong.composer}</dd>
                            </div>
                          ) : (
                            <>
                              <div>
                                <dt>작곡</dt>
                                <dd>{currentSong.composer}</dd>
                              </div>
                              {currentSong.lyricist !== null && (
                                <div>
                                  <dt>작사</dt>
                                  <dd>{currentSong.lyricist}</dd>
                                </div>
                              )}
                            </>
                          )}
                        </dl>
                      </div>
                    ) : (
                      <div className={musicStyles.controller}>
                        {!isLyrics && (
                          <div className={musicStyles.summary}>
                            <h2>{currentSong.music}</h2>
                            <cite>
                              {currentSong.instrument ? (
                                <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                              ) : currentSong.cover !== null ? (
                                <>
                                  {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                                </>
                              ) : (
                                currentSong.artist
                              )}
                            </cite>
                            <dl>
                              {currentSong.cover !== null && (
                                <div>
                                  <dt>원곡</dt>
                                  <dd>{currentSong.artist}</dd>
                                </div>
                              )}
                              <div>
                                <dt>수록앨범</dt>
                                <dd>{currentSong.album}</dd>
                              </div>
                              {currentSong.composer === currentSong.lyricist ? (
                                <div>
                                  <dt>작곡/작사</dt>
                                  <dd>{currentSong.composer}</dd>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <dt>작곡</dt>
                                    <dd>{currentSong.composer}</dd>
                                  </div>
                                  {currentSong.lyricist !== null && (
                                    <div>
                                      <dt>작사</dt>
                                      <dd>{currentSong.lyricist}</dd>
                                    </div>
                                  )}
                                </>
                              )}
                            </dl>
                          </div>
                        )}
                        <button type="button" className={musicStyles.seekbar} onClick={handleSeekBarClick}>
                          <span
                            style={{
                              width: `${(currentTime / duration) * 100}%`,
                            }}
                          />
                          {duration !== undefined && duration > 0 && (
                            <>
                              {currentTime < duration - 1 && (
                                <em
                                  style={{
                                    left: `calc(${(currentTime / duration) * 100}% - ${rem(6)})`,
                                  }}
                                  className={`${(currentTime / duration) * 100 < 5 ? musicStyles.left : ''} ${
                                    (currentTime / duration) * 100 > 95 ? musicStyles.right : ''
                                  }`}
                                >
                                  <i>{formatTime(currentTime)}</i>
                                </em>
                              )}
                            </>
                          )}
                        </button>
                        <div className={musicStyles.option}>
                          {duration !== undefined && duration > 0 && (
                            <div className={musicStyles.duration}>{formatTime(duration)}</div>
                          )}
                          <div className={musicStyles.lyricsText}>
                            <button onClick={toggleLyrics} type="button">
                              {isLyrics ? (
                                <>
                                  <LyricsEnabledIcon />
                                  <span>가사 숨기기</span>
                                </>
                              ) : (
                                <>
                                  <LyricsDisabledIcon />
                                  <span>가사 보기</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className={musicStyles.play}>
                            <button className={musicStyles['skip-button']} type="button" onClick={onPrevious}>
                              <PrevIcon />
                              <span>이전곡 재생</span>
                            </button>
                            <button className={musicStyles['play-button']} type="button" onClick={handlePlayPause}>
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
                            <button onClick={toggleLoop} type="button">
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
                    )}
                  </div>
                  <div className={musicStyles.youtube}>
                    <YouTube
                      videoId={currentSong.videoid}
                      opts={opts}
                      onReady={(event) => {
                        onReady(event);
                        playerRef1.current = event.target;
                        updateCurrentTimeAndDuration();
                      }}
                      onStateChange={(event: YouTubeEvent<any>) => {
                        if (event.data === 1) {
                          handlePlayPauseClick(true, false);
                        } else if (event.data === 2) {
                          handlePlayPauseClick(false, false);
                        } else if (event.data === 0) {
                          handleEnd();
                        }
                      }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {!isLandscape && isLyrics && currentSong.lyrics && (
                <div className={musicStyles['music-lyrics']}>
                  <div className={musicStyles['music-info']}>
                    <div className={musicStyles['song-cover']}>
                      <Image
                        src={`https://cdn.dev1stud.io/nol2tr/_/${currentSong.videoid}.webp`}
                        width={47}
                        height={47}
                        alt=""
                        unoptimized
                      />
                    </div>
                    <div className={musicStyles.summary}>
                      <h2>{currentSong.music}</h2>
                      <cite>
                        {currentSong.instrument ? (
                          <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                        ) : currentSong.cover !== null ? (
                          <>
                            {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                          </>
                        ) : (
                          currentSong.artist
                        )}
                      </cite>
                    </div>
                  </div>
                  <div className={musicStyles.lyrics}>
                    <PerfectScrollbar className={styles['scrollbar-container']}>
                      <p dangerouslySetInnerHTML={{ __html: currentSong.lyrics.replace(/\n/g, '<br />') }} />
                    </PerfectScrollbar>
                  </div>
                </div>
              )}
              <div className={musicStyles.thumbnail}>
                {(isLandscape || (!isLandscape && !isLyrics) || !currentSong.lyrics) && (
                  <div>
                    <Image
                      src={`https://cdn.dev1stud.io/nol2tr/-/${currentSong.videoid}.webp`}
                      width={720}
                      height={720}
                      alt=""
                      unoptimized
                    />
                  </div>
                )}
                {isLandscape ? (
                  <div className={musicStyles.summary}>
                    <h2>{currentSong.music}</h2>
                    <cite>
                      {currentSong.instrument ? (
                        <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                      ) : currentSong.cover !== null ? (
                        <>
                          {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                        </>
                      ) : (
                        currentSong.artist
                      )}
                    </cite>
                    <dl>
                      {currentSong.cover !== null && (
                        <div>
                          <dt>원곡</dt>
                          <dd>{currentSong.artist}</dd>
                        </div>
                      )}
                      <div>
                        <dt>수록앨범</dt>
                        <dd>{currentSong.album}</dd>
                      </div>
                      {currentSong.composer === currentSong.lyricist ? (
                        <div>
                          <dt>작곡/작사</dt>
                          <dd>{currentSong.composer}</dd>
                        </div>
                      ) : (
                        <>
                          <div>
                            <dt>작곡</dt>
                            <dd>{currentSong.composer}</dd>
                          </div>
                          {currentSong.lyricist !== null && (
                            <div>
                              <dt>작사</dt>
                              <dd>{currentSong.lyricist}</dd>
                            </div>
                          )}
                        </>
                      )}
                    </dl>
                  </div>
                ) : (
                  <div className={musicStyles.controller}>
                    {(!isLyrics || !currentSong.lyrics) && (
                      <div className={musicStyles.summary}>
                        <h2>{currentSong.music}</h2>
                        <cite>
                          {currentSong.instrument ? (
                            <>{currentSong.artist !== null ? currentSong.artist : currentSong.composer}</>
                          ) : currentSong.cover !== null ? (
                            <>
                              {currentSong.cover} 커버 ({currentSong.artist} 원곡)
                            </>
                          ) : (
                            currentSong.artist
                          )}
                        </cite>
                        <dl>
                          {currentSong.cover !== null && (
                            <div>
                              <dt>원곡</dt>
                              <dd>{currentSong.artist}</dd>
                            </div>
                          )}
                          <div>
                            <dt>수록앨범</dt>
                            <dd>{currentSong.album}</dd>
                          </div>
                          {currentSong.composer === currentSong.lyricist ? (
                            <div>
                              <dt>작곡/작사</dt>
                              <dd>{currentSong.composer}</dd>
                            </div>
                          ) : (
                            <>
                              <div>
                                <dt>작곡</dt>
                                <dd>{currentSong.composer}</dd>
                              </div>
                              {currentSong.lyricist !== null && (
                                <div>
                                  <dt>작사</dt>
                                  <dd>{currentSong.lyricist}</dd>
                                </div>
                              )}
                            </>
                          )}
                        </dl>
                      </div>
                    )}
                    <button type="button" className={musicStyles.seekbar} onClick={handleSeekBarClick}>
                      <span
                        style={{
                          width: `${(currentTime / duration) * 100}%`,
                        }}
                      />
                      {duration !== undefined && duration > 0 && (
                        <>
                          {currentTime < duration - 1 && (
                            <em
                              style={{
                                left: `calc(${(currentTime / duration) * 100}% - ${rem(6)})`,
                              }}
                              className={`${(currentTime / duration) * 100 < 5 ? musicStyles.left : ''} ${
                                (currentTime / duration) * 100 > 95 ? musicStyles.right : ''
                              }`}
                            >
                              <i>{formatTime(currentTime)}</i>
                            </em>
                          )}
                        </>
                      )}
                    </button>
                    <div className={musicStyles.option}>
                      {duration !== undefined && duration > 0 && (
                        <div className={musicStyles.duration}>{formatTime(duration)}</div>
                      )}
                      {currentSong.lyrics ? (
                        <div className={musicStyles.lyricsText}>
                          <button onClick={toggleLyrics} type="button">
                            {isLyrics ? (
                              <>
                                <LyricsEnabledIcon />
                                <span>가사 숨기기</span>
                              </>
                            ) : (
                              <>
                                <LyricsDisabledIcon />
                                <span>가사 보기</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div style={{ width: rem(27) }} />
                      )}
                      <div className={musicStyles.play}>
                        <button className={musicStyles['skip-button']} type="button" onClick={onPrevious}>
                          <PrevIcon />
                          <span>이전곡 재생</span>
                        </button>
                        <button className={musicStyles['play-button']} type="button" onClick={handlePlayPause}>
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
                )}
              </div>
              <div className={musicStyles.youtube}>
                <YouTube
                  videoId={currentSong.videoid}
                  opts={opts}
                  onReady={(event) => {
                    onReady(event);
                    playerRef1.current = event.target;
                    updateCurrentTimeAndDuration();
                  }}
                  onStateChange={(event: YouTubeEvent<any>) => {
                    if (event.data === 1) {
                      handlePlayPauseClick(true, false);
                    } else if (event.data === 2) {
                      handlePlayPauseClick(false, false);
                    } else if (event.data === 0) {
                      handleEnd();
                    }
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {(isLandscape || !showPlayer) && (
        <div className={musicStyles.player}>
          <button type="button" className={musicStyles.seekbar} onClick={handleSeekBarClick}>
            <span
              style={{
                width: `${(currentTime / duration) * 100}%`,
              }}
            />
            {duration !== undefined && duration > 0 && (
              <>
                {currentTime < duration - 1 && (
                  <em
                    style={{
                      left: `calc(${(currentTime / duration) * 100}% - ${rem(6)})`,
                    }}
                    className={`${(currentTime / duration) * 100 < 5 ? musicStyles.left : ''} ${
                      (currentTime / duration) * 100 > 95 ? musicStyles.right : ''
                    }`}
                  >
                    <i>{formatTime(currentTime)}</i>
                  </em>
                )}
              </>
            )}
          </button>
          {duration !== undefined && duration > 0 && <div className={musicStyles.duration}>{formatTime(duration)}</div>}
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
            <button onClick={() => setShowPlayer((prev) => !prev)} type="button">
              <span>{showPlayer ? '플레이어 숨기기' : '플레이어 보기'}</span>
            </button>
          </div>
          <div className={musicStyles.play}>
            <button className={musicStyles['skip-button']} type="button" onClick={onPrevious}>
              <PrevIcon />
              <span>이전곡 재생</span>
            </button>
            <button className={musicStyles['play-button']} type="button" onClick={handlePlayPause}>
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
            <button onClick={toggleLoop} type="button">
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
      )}
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

  const [playMode, setPlayMode] = useState<'one' | 'all'>('all');
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLyrics, setIsLyrics] = useState<boolean>(false);
  const playerRef = useRef<any>(null);

  const handleSongClick = (id: string) => {
    setCurrentSongId(id);
    setIsPlaying(true);
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

  const toggleLyrics = () => {
    setIsLyrics(!isLyrics);
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
          {ios === 'isIOS' && (
            <p className={styles.link}>
              아이폰/아이패드는 <Anchor href="/musics-ios">여기</Anchor>로 이동하세요!
            </p>
          )}
          {musicError ? (
            <p>API 서버에 오류가 있습니다. 잠시 후 이용해 주세요.</p>
          ) : (
            <>
              {ios !== 'isIOS' && !loading && (
                <>
                  <div className={`${musicStyles.control} ${playMode === 'all' ? musicStyles.all : ''}`}>
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
      {playMode === 'all' && currentSongId !== null && (
        <Player
          currentSong={musicsData.find((music) => music.id === currentSongId)!}
          onPrevious={handlePrevious}
          onNext={handleNext}
          playMode={playMode}
          isLooping={isLooping}
          toggleLoop={toggleLoop}
          toggleLyrics={toggleLyrics}
          isLyrics={isLyrics}
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
