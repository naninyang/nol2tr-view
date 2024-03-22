import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import styled from '@emotion/styled';
import { MusicData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import YouTubeController from '@/components/YouTubeController';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Pages.module.sass';
import music from '@/styles/Music.module.sass';

interface NoticeProps {
  musics: MusicData[];
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

const Musics: NextPage<NoticeProps> = ({ musics }) => {
  const router = useRouter();
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);
  const [musicsData, setMusicsData] = useState<MusicData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let mergedData: MusicData[] = [];
      let hasMoreData = true;
      let page = 1;

      while (hasMoreData) {
        const response = await fetch(`/api/musics?page=${page}`);
        const data = await response.json();

        if (data.length === 0) {
          hasMoreData = false;
        } else {
          mergedData = mergedData.concat(data);
          page++;
        }
      }

      const sortedData = mergedData.sort((a, b) => {
        if (a.music < b.music) return -1;
        if (a.music > b.music) return 1;
        return 0;
      });

      setMusicsData(sortedData);
    } catch (error) {
      console.error('왜 여기서 오류가 나와?', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleButtonClick = (id: string) => {
    setSelectedMusicId(selectedMusicId === id ? null : id);
    document.querySelector(`#music${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    <main className={`${content.content} ${styles.pages} ${styles.music}`}>
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
        <div className={music.musics}>
          <hr />
          {isLoading ? (
            <>
              <p>곡 목록을 가져오는 중입니다.</p>
              <p>잠시만 기다려 주세요!</p>
            </>
          ) : (
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
                  {selectedMusicId === music.id && (
                    <div id={`music${music.id}`}>
                      <YouTubeController videoId={music.videoid} start={music.start} vi={music.vvi} />
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
                        <div>
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
                        </div>
                        {music.composer === music.lyricist ? (
                          <div>
                            <div>
                              <dt>작곡/작사</dt>
                              <dd>{music.composer}</dd>
                            </div>
                          </div>
                        ) : (
                          <div>
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
                          </div>
                        )}
                      </dl>
                      {music.lyrics !== null && (
                        <p dangerouslySetInnerHTML={{ __html: music.lyrics.replace(/\n/g, '<br />') }} />
                      )}
                      <button type="button" onClick={() => handleButtonClick(music.id)}>
                        곡 정보 닫기
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default Musics;
