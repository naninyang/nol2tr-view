import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styled from '@emotion/styled';
import { MusicData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import YouTubeController from '@/components/YouTubeController';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Pages.module.sass';
import musicStyles from '@/styles/Music.module.sass';
import 'react-perfect-scrollbar/dist/css/styles.css';

type MusicDetailProps = {
  music: MusicData;
  onClose: () => void;
};

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
  return (
    <dialog className={musicStyles.dialog}>
      <div className={musicStyles.container}>
        <button type="button" onClick={onClose}>
          <CloseIcon />
          <span>닫기</span>
        </button>
        <div className={musicStyles.info}>
          <PerfectScrollbar className={styles['scrollbar-container']}>
            {music.lyrics === null && (
              <div className={musicStyles.summary}>
                <h2>{music.music}</h2>
                <cite>
                  {music.instrument
                    ? music.artist !== null
                      ? music.artist
                      : music.composer
                    : music.cover !== null
                    ? music.cover
                    : music.artist}
                </cite>
                <dl>
                  <div>
                    <dt>유튜브뮤직</dt>
                    <dd>
                      <Anchor href={`https://music.youtube.com/watch?v=${music.videoid}`}>
                        <YTmusicIcon />
                        <span>YouTube Music</span>에서 고음질로 듣기
                      </Anchor>
                    </dd>
                  </div>
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
              <YouTubeController videoId={music.videoid} start={music.start} vi={music.vvi} />
            </div>
          </PerfectScrollbar>
        </div>
        {music.lyrics !== null && (
          <div className={musicStyles.lyrics}>
            <div className={musicStyles.summary}>
              <h2>{music.music}</h2>
              <cite>
                {music.instrument
                  ? music.artist !== null
                    ? music.artist
                    : music.composer
                  : music.cover !== null
                  ? music.cover
                  : music.artist}
              </cite>
            </div>
            <dl>
              <div>
                <dt>유튜브뮤직</dt>
                <dd>
                  <Anchor href={`https://music.youtube.com/watch?v=${music.videoid}`}>
                    <YTmusicIcon />
                    <span>YouTube Music</span>에서 고음질로 듣기
                  </Anchor>
                </dd>
              </div>
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
              <p dangerouslySetInnerHTML={{ __html: music.lyrics.replace(/\n/g, '<br />') }} />
            </PerfectScrollbar>
          </div>
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
          <hr />
          <ul>
            {musicsData.map((music, index) => (
              <li key={music.id}>
                <button type="button" onClick={() => handleButtonClick(music.id)}>
                  <span>
                    <i>{index + 1}</i>
                    <strong>{music.music}</strong>
                    <em>
                      {music.instrument
                        ? music.artist !== null
                          ? music.artist
                          : music.composer
                        : music.cover !== null
                        ? music.cover
                        : music.artist}
                    </em>
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
