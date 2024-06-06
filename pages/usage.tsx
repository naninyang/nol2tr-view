import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import Seo, { originTitle } from '@/components/Seo';
import { images } from '@/components/images';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Page.module.sass';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

export default function Usage() {
  const router = useRouter();

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
    <main className={`${content.content} ${styles.page}`}>
      <Seo
        pageTitles={`이용 안내 - ${originTitle}`}
        pageTitle="이용 안내"
        pageDescription="놀이터뷰 이용 안내"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className="top-link">
        <button onClick={previousPageHandler} type="button">
          <BackButton />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className={styles['page-content']}>
        <h1 className={styles['usage-headline']}>
          <span>이용 안내 usage</span>
        </h1>
        <div className={styles.container}>
          <article>
            <h2>놀이터뷰</h2>
            <section>
              <p>
                놀이터뷰는 유튜브와 네이버 뉴스에 업로드된 맨투맨 인터뷰와 뉴스 관련된 곡을 추천해주는 뉴스 큐레이팅 &
                곡 추천 서비스입니다.
              </p>
              <p>노래를 들으면서 뉴스를 즐겨보세요!</p>
            </section>
          </article>
          <article>
            <h2>뉴스 및 음원 이용 안내</h2>
            <section>
              <p>
                뉴스와 직/간접적 관련이 있는 곡을 추천해 드리며, 유튜브에서 가져온 영상의 타입(뮤직비디오/가사첨부 여부
                등)에 따라서 UX를 다르게 하여 보기 편하게 서비스 됩니다.
              </p>
            </section>
          </article>
          <article>
            <h2>유의사항</h2>
            <section>
              <p>이 서비스는 Vercel, AWS, Google 그리고 네이버와 관련이 없습니다.</p>
              <p>뉴스 콘텐츠에 대한 저작권은 각 언론사에 있으며 곡에 대한 저작권은 저작권리사에 있습니다.</p>
              <p>자세한 내용은 저작권 안내 페이지를 참고하여 주시기 바랍니다.</p>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
