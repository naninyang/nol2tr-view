import { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import styled from '@emotion/styled';
import { MusicData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Pages.module.sass';
import music from '@/styles/Music.module.sass';
import YouTubeController from '@/components/YouTubeController';

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

const Musics: NextPage<NoticeProps> = ({ musics }) => {
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const [musicsData, setMusicsData] = useState<MusicData[]>([]);
  useEffect(() => {
    const sortedMusics = [...musics].sort((a, b) => a.music.localeCompare(b.music));
    setMusicsData(sortedMusics);
  }, [musics]);

  const handleButtonClick = (id: string) => {
    setSelectedMusicId(selectedMusicId === id ? null : id);
    document.querySelector(`#music${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        {currentPage ? (
          <Anchor href={`/${currentPage}`}>
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        ) : (
          <Anchor href="/">
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        )}
      </div>
      <div className={styles['pages-content']}>
        <h1>
          <span>선곡표 music_table</span>
        </h1>
        <div>
          <p>🎶 놀이터뷰에서 선곡한 곡 목록입니다 🎵</p>
          <p>👉 곡은 수시로 업데이트 됩니다 👉</p>
        </div>
        <div className={music.musics}>
          <hr />
          <ul>
            {musicsData.map((music) => (
              <li key={music.id}>
                <button type="button" onClick={() => handleButtonClick(music.id)}>
                  <span>
                    <strong>{music.music}</strong>{' '}
                    <em>{music.instrument ? (music.artist !== null ? music.artist : music.composer) : music.artist}</em>
                  </span>
                </button>
                {selectedMusicId === music.id && (
                  <div id={`music${music.id}`}>
                    <YouTubeController videoId={music.videoid} start={music.start} vi={music.vvi} />
                    <dl>
                      <div>
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
        </div>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/musics`);
  const data = await response.json();

  return {
    props: { musics: data },
  };
};

export default Musics;
