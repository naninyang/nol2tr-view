import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import styled from '@emotion/styled';
import Seo, { originTitle } from '@/components/Seo';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Open.module.sass';
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

function OpenSources({ licenses }: { licenses: string[] }) {
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
    <main className={`${content.content} ${styles['open_sources']}`}>
      <Seo
        pageTitles={`오픈소스 - ${originTitle}`}
        pageTitle="오픈소스"
        pageDescription="놀이터뷰에서 사용한 오픈소스"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className="top-link">
        <button onClick={previousPageHandler} type="button">
          <BackButton />
          <span>뒤로가기</span>
        </button>
      </div>
      <div className={styles['open_sources-content']}>
        <h1>
          <span>오픈소스 open_sources</span>
        </h1>
        <dl>
          <div>
            <dt>UX Designer</dt>
            <dd>클로이 Chloe</dd>
          </div>
          <div>
            <dt>Developer</dt>
            <dd>클로이 Chloe</dd>
          </div>
          <div>
            <dt>News & Music Curator</dt>
            <dd>클로이 Chloe</dd>
          </div>
        </dl>
        <div className={styles.list}>
          <hr />
          {licenses.map((license, index) => (
            <div key={index}>
              <pre>
                <code>{license}</code>
              </pre>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const markdownDir = path.join(process.cwd(), 'pages/licenses');
  const filenames = fs.readdirSync(markdownDir);
  const licenses = filenames.map((filename) => {
    const filePath = path.join(markdownDir, filename);
    return fs.readFileSync(filePath, 'utf8');
  });

  return {
    props: {
      licenses,
    },
  };
}

export default OpenSources;
