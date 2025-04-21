import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import Seo, { originTitle } from '@/components/Seo';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Page.module.sass';
import { ArrowBackDark, ArrowBackLight } from '@/components/images';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${ArrowBackLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ArrowBackDark.src}) no-repeat 50% 50%/contain`,
  },
});

export default function Licenses() {
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
        pageTitles={`저작권 안내 - ${originTitle}`}
        pageTitle="저작권 안내"
        pageDescription="놀이터뷰 저작권 안내"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className="top-link">
        <button onClick={previousPageHandler} type="button">
          <BackButton />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className={styles['page-content']}>
        <h1 className={styles['licenses-headline']}>
          <span>저작권 안내 licenses</span>
        </h1>
        <div className={styles.container}>
          <article>
            <h2>소스 저작권 안내</h2>
            <section>
              <p>
                모든 유튜브 영상은 유튜브 및 각 영상 제작자/언론사에서 저작권을 가지며, 영상에서 사용된 원본 소스는 원본
                소스 제작사에서 저작권을 가집니다.
              </p>
            </section>
          </article>
          <article>
            <h2>언론사의 권리</h2>
            <section>
              <p>모든 뉴스 및 기사는 뉴스 영상 제작 또는 기사를 작성한 언론사 및 기자에게 저작권이 있습니다.</p>
              <p>놀이터뷰는 전문이 아닌 일부를 발췌하여 가져옵니다.</p>
              <p>
                썸네일 또는 오픈그래프에 사용한 이미지는 기사에서 가져오거나 인터넷에서 관련 이미지를 가져와 서버에 저장
                후, 보여지게 됩니다.
              </p>
            </section>
          </article>
          <article>
            <h2>음원 및 뮤직비디오 저작권자의 권리</h2>
            <section>
              <p>
                뉴스 및 기사에 연결된 음원 및 뮤직비디오의 저작권은 음원 콘텐츠를 제작하거나 퍼블리싱한 인접
                관계자들에게 저작권이 있습니다.
              </p>
              <p>
                또한 추천된 음원 및 뮤직비디오는 저작권자에 의해 영상이 비공개 되거나 유튜브에서만 시청/청취가 가능하게
                전환될 수 있습니다. <span>이 경우, 놀이터뷰 운영자는 확인 후 다른 영상으로 교체할 수 있습니다.</span>
              </p>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
