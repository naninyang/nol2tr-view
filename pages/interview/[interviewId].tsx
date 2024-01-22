import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { InterviewParalinkData } from 'types';
import Seo, { originTitle } from '@/components/Seo';
import YouTubeController from '@/components/YouTubeController';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import styled from '@emotion/styled';
import styles from '@/styles/Interview.module.sass';

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

export default function interviewDetail({
  interviewData,
  idx,
}: {
  interviewData: InterviewParalinkData | null;
  idx: string;
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

  if (!interviewData) {
    if (timeoutReached) {
      return (
        <main className={styles.interview}>
          <p className={styles.error}>
            기사를 불러오지 못했습니다. 삭제된 기사이거나 인터넷 속도가 느립니다.{' '}
            <Anchor href="/interviews">뒤로가기</Anchor>
          </p>
        </main>
      );
    } else {
      return (
        <main className={styles.interview}>
          <p className={styles.loading}>기사 읽는 중...</p>
        </main>
      );
    }
  }

  return (
    <main className={styles.interview}>
      <Seo
        pageTitles={`${interviewData.attributes.subject} / 추천곡_ ${interviewData.attributes.music}_${interviewData.attributes.artist} - ${originTitle}`}
        pageTitle={`${interviewData.attributes.subject} / 추천곡_ ${interviewData.attributes.music}_${interviewData.attributes.artist}`}
        pageDescription={interviewData.attributes.summary}
        pageImg={
          interviewData.attributes.platform === 'youtube'
            ? `https://i.ytimg.com/vi/${interviewData.attributes.vid}/maxresdefault.webp`
            : `https://cdn.dev1stud.io/nol2tr/${interviewData.attributes.thumbnail}.webp`
        }
        pageOgType={interviewData.attributes.platform === 'youtube' ? 'video.other' : 'article'}
      />
      <div className="top-link">
        {savedScrollPosition ? (
          <button onClick={handleBackClick}>
            <BackButton />
            <span>뒤로가기</span>
          </button>
        ) : (
          <Anchor href="/interviews">
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        )}
      </div>
      <article className={styles['article-news']}>
        <header>
          <h1>
            {interviewData.attributes.subject}{' '}
            <span>
              추천곡_ {interviewData.attributes.artist}. {interviewData.attributes.music}.
            </span>
          </h1>
          <time>{interviewData.attributes.created}</time>
        </header>
        <div className={styles.news}>
          {interviewData.attributes.platform === 'youtube' ? (
            <YouTubeController videoId={interviewData.attributes.vid} />
          ) : (
            <>
              {interviewData.attributes.platform === 'naverNews' ? (
                <Anchor
                  href={`https://n.news.naver.com/article/${interviewData.attributes.oid}/${interviewData.attributes.aid}`}
                >
                  <img src={`https://cdn.dev1stud.io/nol2tr/${interviewData.attributes.thumbnail}.webp`} alt="" />
                </Anchor>
              ) : (
                <Anchor
                  href={`https://entertain.naver.com/read?oid=${interviewData.attributes.oid}&aid=${interviewData.attributes.aid}`}
                >
                  <img src={`https://cdn.dev1stud.io/nol2tr/${interviewData.attributes.thumbnail}.webp`} alt="" />
                </Anchor>
              )}
            </>
          )}
          <dl>
            <div>
              <dt>인터뷰어</dt>
              <dd>{interviewData.attributes.interviewer}</dd>
            </div>
            <div>
              <dt>인터뷰이</dt>
              <dd>{interviewData.attributes.interviewee}</dd>
            </div>
          </dl>
          <p dangerouslySetInnerHTML={{ __html: interviewData.attributes.description.replace(/\n/g, '<br />') }} />
        </div>
        <hr />
        <div className={styles.music}>
          <h2>
            <strong>추천곡</strong> {interviewData.attributes.music}
          </h2>
          <YouTubeController videoId={interviewData.attributes.videoid} start={interviewData.attributes.start} />
          <div className={styles.info}>
            <dl>
              <div>
                <div>
                  <dt>노래</dt>
                  <dd>{interviewData.attributes.artist}</dd>
                </div>
                <div>
                  <dt>수록앨범</dt>
                  <dd>{interviewData.attributes.album}</dd>
                </div>
              </div>
              <div>
                <div>
                  <dt>작곡</dt>
                  <dd>{interviewData.attributes.composer}</dd>
                </div>
                <div>
                  <dt>작사</dt>
                  <dd>{interviewData.attributes.lyricist}</dd>
                </div>
              </div>
            </dl>
            <p dangerouslySetInnerHTML={{ __html: interviewData.attributes.lyrics.replace(/\n/g, '<br />') }} />
          </div>
        </div>
      </article>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const interviewId = context.params?.interviewId;
  let interviewData = null;

  if (interviewId && typeof interviewId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interview?id=${interviewId.substring(14)}`);
    const data = (await response.json()) as { data: InterviewParalinkData[] };
    interviewData = data.data;
  }

  if (!interviewData) {
    return {
      props: {
        interviewData: null,
      },
    };
  }

  return {
    props: {
      interviewData,
      idx: interviewId,
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
