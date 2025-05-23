import { useRouter } from 'next/router';
import { isSafari } from 'react-device-detect';
import styled from '@emotion/styled';
import Seo, { originTitle } from '@/components/Seo';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Page.module.sass';
import { useEffect, useState } from 'react';
import { ArrowBackDark, ArrowBackLight, MiscSymbolDark, MiscSymbolLight } from '@/components/images';

interface Counts {
  interview: number;
  newsic: number;
  musics: number;
}

const Apple = styled.article({
  '& i': {
    'body[data-theme="dark"] &': {
      background: `url(${MiscSymbolLight.src}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${MiscSymbolDark.src}) no-repeat 50% 50%/contain`,
    },
  },
});

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${ArrowBackLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ArrowBackDark.src}) no-repeat 50% 50%/contain`,
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

  const [count, setCount] = useState<Counts | null>(null);

  async function fetchCountData() {
    try {
      const response = await fetch(`/api/contentTotalCount`);
      const data = await response.json();
      setCount(data);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    fetchCountData();
  }, []);

  function formatNumber(value: number): string {
    return value.toLocaleString();
  }

  const [deviceSafari, setDeviceSafari] = useState<string>();

  useEffect(() => {
    if (isSafari) {
      setDeviceSafari('isSafari');
    }
  }, []);

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${content.page} ${styles.page}`}>
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
        <h1>
          <span>놀이터뷰 nol2tr_view</span>
          <i>
            <svg
              width="52"
              height="48"
              viewBox="0 0 52 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svg1}
            >
              <path
                d="M24.5304 0.526081C24.0795 0.687464 18.8293 3.72146 12.8705 7.33644C4.04505 12.6298 1.887 14.0823 1.30723 15.0506C0.566406 16.2125 0.566406 16.2448 0.566406 29.7687C0.566406 41.9692 0.630826 43.4217 1.11397 44.3254C2.33794 46.5525 4.59262 47.6822 6.97613 47.2303C7.58812 47.1012 12.484 44.2286 17.9918 40.7427L27.9446 34.4488L28.1057 38.8707C28.2989 43.8413 28.6533 44.971 30.6825 46.2943C31.7132 47.0044 31.9709 47.0367 39.7012 47.0367C47.4315 47.0367 47.6892 47.0044 48.7521 46.2943C49.3319 45.907 50.1693 45.0678 50.5558 44.4868L51.2967 43.3894V29.8655C51.2967 15.3733 51.2967 15.4056 49.6218 13.9209C48.3334 12.7266 28.46 0.9134 27.2038 0.558357C25.851 0.203315 25.69 0.203315 24.5304 0.526081ZM36.3192 10.7578C41.827 14.05 46.4974 16.9226 46.7229 17.084C47.0128 17.3422 47.1094 20.2471 47.1094 29.6073C47.1094 36.3208 47.0128 42.0338 46.9161 42.3243C46.7551 42.7762 45.821 42.8407 39.83 42.8407C33.3559 42.8407 32.9371 42.8084 32.615 42.2275C32.4218 41.8724 32.2929 39.3226 32.2929 36.224C32.2929 30.5433 32.1319 29.801 30.618 28.4453C30.2315 28.058 26.624 26.0892 22.63 24.0234C10.8735 17.9877 7.58812 16.2125 7.45928 15.9866C7.29823 15.6961 25.1746 4.78659 25.851 4.78659C26.1409 4.75432 30.8435 7.46555 36.3192 10.7578ZM11.3244 23.0229C14.6098 24.7658 19.1514 27.122 21.4061 28.284C23.6608 29.4459 25.5289 30.511 25.5289 30.6402C25.5289 30.737 24.0473 31.7698 22.2435 32.9318C20.4076 34.0937 16.0271 36.8373 12.5162 39.0643C7.26602 42.3888 6.00984 43.0666 5.5267 42.8084C4.94692 42.5179 4.91471 41.8724 4.91471 31.2211C4.91471 24.9917 5.01134 19.9243 5.10797 19.9243C5.23681 19.9243 8.03905 21.3122 11.3244 23.0229Z"
                fill="#332941"
              />
            </svg>
            <svg
              width="147"
              height="49"
              viewBox="0 0 147 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svg2}
            >
              <path
                d="M104.119 48.329V1.28174H130.702V4.17353H107.449V21.858H129.037V24.7498H107.449V45.4372H116.772C122.877 45.4372 129.021 45.4418 129.021 45.4418V48.3205C129.021 48.3205 122.877 48.329 116.772 48.329H104.119ZM131.423 21.858H143.521V1.28174H146.851V48.329H143.521V24.7498H131.423V21.858Z"
                fill="#F48C06"
              />
              <path
                d="M52.25 14.905C52.25 6.78577 56.3012 0.724121 66.679 0.724121C77.0568 0.724121 81.108 6.78577 81.108 14.905V34.7027C81.108 42.822 77.0568 48.8836 66.679 48.8836C56.3012 48.8836 52.25 42.822 52.25 34.7027V14.905ZM91.9297 48.3275V1.28024H95.2595V48.3275H91.9297ZM66.679 45.9918C74.8924 45.9918 77.7782 41.3205 77.7782 34.7027V14.905C77.7782 8.28728 74.8924 3.61591 66.679 3.61591C58.4656 3.61591 55.5798 8.28728 55.5798 14.905V34.7027C55.5798 41.3205 58.4656 45.9918 66.679 45.9918Z"
                fill="#F48C06"
              />
              <path
                d="M0.375 21.2462H20.6311V15.2402H0.929962V1.28174H4.25973V12.3484H43.9395V15.2402H23.9609V21.2462H44.2169V24.138H0.375V21.2462ZM0.929962 48.329V37.0955H40.3322V32.1461H0.929962V29.2543H43.662V39.9873H4.25973V45.4372H44.2169V48.329H0.929962Z"
                fill="#F48C06"
              />
            </svg>
            <svg
              width="44"
              height="48"
              viewBox="0 0 44 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svg3}
            >
              <path
                d="M40.1154 18.8559V0.281738H43.4452V21.7477H0.713171V0.281738H4.04294V18.8559H40.1154ZM27.1391 47.329V31.2017H16.361V44.2782H13.0312V31.1974L10.4903 31.2017V47.329H7.16051V31.2017H0.158203V28.3099H44.0001V31.2017L36.3396 31.1974V44.2782H33.0098V31.2017H30.4689V47.329H27.1391Z"
                fill="#0A9396"
              />
              <path
                d="M25.7207 8.86767C25.7207 7.48929 24.6043 6.37061 23.2288 6.37061L20.7369 6.37061C19.3614 6.37061 18.245 7.48929 18.245 8.86767C18.245 10.246 19.3614 11.3647 20.7369 11.3647L23.2288 11.3647C24.6043 11.3647 25.7207 10.246 25.7207 8.86767Z"
                fill="#332941"
              />
            </svg>
            <svg
              width="262"
              height="44"
              viewBox="0 0 262 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.svg4}
            >
              <path
                d="M262.001 12.0532L252.833 43.1014H248.911L240.969 16.229L233.027 43.1014H229.154L219.938 12.0532H222.879L231.164 40.5468L239.744 12.0532H242.195L250.774 40.5468L259.059 12.0532H262.001Z"
                fill="#0A9396"
              />
              <path
                d="M203.485 41.1854C210.054 41.1854 213.927 37.6483 213.927 33.7672V33.2268H216.771V34.2585C216.771 38.9747 211.77 43.74 203.485 43.74C194.71 43.74 189.709 37.9921 189.709 30.8196V24.3349C189.709 17.1624 194.71 11.4146 203.485 11.4146C212.26 11.4146 217.261 17.1624 217.261 24.3349V28.5598H192.552V30.3284C192.552 36.6657 196.425 41.1854 203.485 41.1854ZM214.418 26.1526V24.8262C214.418 18.4888 210.545 13.9691 203.485 13.9691C196.425 13.9691 192.552 18.4888 192.552 24.8262V26.1526H214.418Z"
                fill="#0A9396"
              />
              <path d="M184.633 43.0999H181.789V12.0518H184.633V43.0999Z" fill="#0A9396" />
              <path
                d="M178.14 12.0532L165.54 43.1014H161.814L149.215 12.0532H152.205L163.677 40.5468L175.149 12.0532H178.14Z"
                fill="#0A9396"
              />
              <path
                d="M122.463 12.0523V19.4214C124.571 15.0491 129.768 11.5611 135.798 11.9541V14.7052C129.376 14.3122 124.522 18.3897 122.463 23.3515V43.1005H119.521V12.0523H122.463Z"
                fill="#F48C06"
              />
              <path
                d="M116.113 43.1028H112.926C108.269 43.1028 106.21 39.8113 106.21 34.9477V14.6092H101.65V12.0546H106.308V1.5415H109.249V12.0546H115.623V14.6092H109.249V35.1442C109.249 38.4357 110.132 40.5482 113.612 40.5482H116.113V43.1028Z"
                fill="#F48C06"
              />
              <path
                d="M70.7881 43.1029V41.0396L87.9468 24.533C92.0159 20.6029 94.0259 17.164 94.0259 13.1356C94.0259 7.04387 90.9864 3.50674 84.0739 3.50674C77.0143 3.50674 73.7786 7.8299 73.5825 14.462H70.543C70.543 7.14212 75.3964 0.952148 84.1719 0.952148C92.3591 0.952148 96.8694 5.42268 96.8694 13.3812C96.8694 17.7044 94.6632 21.6837 89.6137 26.449L74.612 40.5483H84.5151C89.4176 40.5483 94.271 40.401 98.4382 39.9097V42.4643C94.271 42.9555 89.1725 43.1029 84.27 43.1029H70.7881Z"
                fill="#F48C06"
              />
              <path
                d="M62.4258 39.2218C62.4258 36.1759 62.4258 1.5415 62.4258 1.5415H65.2692L65.2692 43.7414H62.4258V39.2218Z"
                fill="#F48C06"
              />
              <path
                d="M43.4899 11.4146C52.4615 11.4146 57.511 17.1624 57.511 24.3349V30.8196C57.511 37.9921 52.4615 43.74 43.4899 43.74C34.5183 43.74 29.4688 37.9921 29.4688 30.8196V24.3349C29.4688 17.1624 34.5183 11.4146 43.4899 11.4146ZM32.3122 30.3284C32.3122 36.6657 36.2342 41.1854 43.4899 41.1854C50.7456 41.1854 54.6676 36.6657 54.6676 30.3284V24.8262C54.6676 18.4888 50.7456 13.9691 43.4899 13.9691C36.2342 13.9691 32.3122 18.4888 32.3122 24.8262V30.3284Z"
                fill="#F48C06"
              />
              <path
                d="M16.1587 12.0054C21.3553 12.0054 25.2773 14.8056 25.2773 21.5851V43.1026H22.4339V21.0938C22.4339 16.7215 19.7865 14.4617 16.1587 14.4617C11.4033 14.4617 7.04005 16.2303 3.31415 18.2445V43.1026H0.470703V12.1036H3.31415V15.4934C7.04005 13.8231 11.5994 12.0054 16.1587 12.0054Z"
                fill="#F48C06"
              />
              <path
                d="M149.215 28.458C149.215 27.0796 148.098 25.9609 146.723 25.9609L144.231 25.9609C142.856 25.9609 141.739 27.0796 141.739 28.458C141.739 29.8364 142.856 30.9551 144.231 30.9551L146.723 30.9551C148.098 30.9551 149.215 29.8364 149.215 28.458Z"
                fill="#332941"
              />
            </svg>
          </i>
        </h1>
        <div className={styles.summary}>
          <p>
            <span>놀이터뷰는 유튜브와 네이버 뉴스에 업로드된 맨투맨 인터뷰와 뉴스 관련된 곡을</span> 추천해주는 뉴스
            큐레이팅 & 곡 추천 서비스입니다.
          </p>
          <p>노래를 들으면서 뉴스를 즐겨보세요!</p>
        </div>
        <div className={styles.sections}>
          <section className={styles.interview}>
            <div className={styles.preview} aria-hidden>
              <img src="https://i.ytimg.com/vi_webp/nrH4sJ4iCuY/hqdefault.webp" alt="" />
              <span>&quot;나를 알고 싶어 그린다&quot;…화가로 돌아온 배우 박신양.</span>
              <p className={styles.summary}>
                &quot;나를 알고 싶어 그림을 그린다.&quot; 믿고 보는 배우에서 화가로 변신한 박신양 씨를 뉴스룸에
                모셨습니다.
              </p>
              <dl>
                <div>
                  <dt>인터뷰어</dt>
                  <dd>강지영 (JTBC 뉴스룸 앵커)</dd>
                </div>
                <div>
                  <dt>인터뷰이</dt>
                  <dd>박신양 (배우, 화가)</dd>
                </div>
              </dl>
              <p className={styles.recommended}>박신양 (원곡 Jessica Folcker). Goodbye.</p>
            </div>
            <div className={styles.content}>
              <div className={styles.headline}>
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.0009 2.54736C10.3439 2.54736 9.00086 3.89036 9.00086 5.54736V11.5474C9.00086 13.2044 10.3439 14.5474 12.0009 14.5474C13.6579 14.5474 15.0009 13.2044 15.0009 11.5474V5.54736C15.0009 3.89036 13.6579 2.54736 12.0009 2.54736ZM6.08875 11.5474C5.48275 11.5474 4.99466 12.0851 5.09266 12.6841C5.58253 15.6838 7.98199 18.0364 11.0009 18.4692V20.5474C11.0009 21.0994 11.4489 21.5474 12.0009 21.5474C12.5529 21.5474 13.0009 21.0994 13.0009 20.5474V18.4692C16.0197 18.0364 18.4192 15.6838 18.9091 12.6841C19.0071 12.0851 18.519 11.5474 17.913 11.5474C17.419 11.5474 17.0116 11.9109 16.9286 12.3989C16.5236 14.7539 14.4719 16.5474 12.0009 16.5474C9.52986 16.5474 7.47813 14.7539 7.07313 12.3989C6.99013 11.9109 6.58375 11.5474 6.08875 11.5474Z"
                    fill="#EE9B00"
                  />
                </svg>
                <h2>2nterview</h2>
              </div>
              <div className={styles.description}>
                <p>맨투맨 인터뷰를 추천 곡을 들으면서 볼 수 있어요.</p>
                <p>유튜브와 네이버 뉴스의 고퀄 인터뷰를 가져와서 서비스됩니다.</p>
              </div>
            </div>
          </section>
          <section className={styles.newsic}>
            <div className={styles.preview} aria-hidden>
              <img src="https://i.ytimg.com/vi_webp/Gj-RVyiVZlE/hqdefault.webp" alt="" />
              <span>&quot;지금 방학이라 올 건데&quot;…앵커도 그만 울어버린 순간.</span>
              <p className={styles.summary}>
                &quot;최윤종 살인 사건&quot; 유족 &quot;내 딸 왜 안 오냐&quot; 절규. &quot;성폭행 살인&quot; 최윤종,
                검거 직후 &quot;너무 빨리 잡혔다&quot; 혼잣말해.
              </p>
              <p className={styles.recommended}>김영옥 (원곡: 임형주). 천개의 바람이 되어 (원작: A Thousand Winds).</p>
            </div>
            <div className={styles.content}>
              <div className={styles.headline}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 3C6.448 3 6 3.448 6 4C6 4.552 6.448 5 7 5H17C17.552 5 18 4.552 18 4C18 3.448 17.552 3 17 3H7ZM5 6C4.448 6 4 6.448 4 7C4 7.552 4.448 8 5 8H19C19.552 8 20 7.552 20 7C20 6.448 19.552 6 19 6H5ZM5 9C3.897 9 3 9.897 3 11V19C3 20.103 3.897 21 5 21H19C20.103 21 21 20.103 21 19V11C21 9.897 20.103 9 19 9H5Z"
                    fill="#EE9B00"
                  />
                </svg>
                <h2>Newsic</h2>
              </div>
              <div className={styles.description}>
                <p>사회에서 이슈되는 뉴스를 추천 곡을 들으면서 즐기세요.</p>
                <p>긴 뉴스, 짧은 뉴스 따지지 않고 가져옵니다.</p>
              </div>
            </div>
          </section>
        </div>
        <div className={styles.container}>
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
        {deviceSafari === 'isSafari' && (
          <Apple className={styles.apple}>
            <h2>애플 디바이스에서 앱 내려받기</h2>
            <p>아이폰, 아이패드, 맥에서 앱을 내려받을 수 있습니다.</p>
            <p>
              <span>
                아이폰, 아이패드에서는 사파리에서 <i />를 누르신 뒤,
              </span>{' '}
              <span>&apos;홈 화면에 추가&apos;를 누르시고</span>{' '}
              <span>맥의 사파리에서는 &apos;파일&apos; 메뉴 &gt; &apos;Dock에 추가&apos;를 누르세요.</span>
            </p>
          </Apple>
        )}
        {count && (
          <dl>
            <div>
              <dt>인터뷰</dt>
              <dd>{formatNumber(count.interview)} 건</dd>
            </div>
            <div>
              <dt>뉴직</dt>
              <dd>{formatNumber(count.newsic)} 건</dd>
            </div>
            <div>
              <dt>추천 곡</dt>
              <dd>{formatNumber(count.musics)} 곡</dd>
            </div>
          </dl>
        )}
      </div>
    </main>
  );
}
