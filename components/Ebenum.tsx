import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { EbenumData } from 'types';
import { images } from './images';
import { FormatDate } from './FormatDate';
import styles from '@/styles/Ebenum.module.sass';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface ebenumProps {
  ebenumNews: EbenumData | undefined;
}

const CrossButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.crossLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.crossDark}) no-repeat 50% 50%/contain`,
  },
});

const EbenumDetail: React.FC<ebenumProps> = ({ ebenumNews }) => {
  const router = useRouter();
  const handleCloseModal = () => {
    router.push('/ebenums');
  };

  return (
    <div className={`${styles.ebenum} ${styles['ebenum-container']}`}>
      <article>
        {ebenumNews ? (
          <>
            <header>
              <button type="button" className="close-btn" onClick={handleCloseModal}>
                <CrossButton />
                <span>닫기</span>
              </button>
              <h1>{ebenumNews.subject}</h1>
            </header>
            <div className={styles['ebenum-content']}>
              <PerfectScrollbar className={styles['scrollbar-container']}>
                {ebenumNews.ebenumMetaData && (
                  <div className={styles['og-container']}>
                    {ebenumNews.ebenumMetaData?.ownerAvatar ? (
                      <img src={ebenumNews.ebenumMetaData?.ogImage} alt="" />
                    ) : (
                      <div className={styles.thumbnails}>
                        <img src={ebenumNews.ebenumMetaData?.ogImage} alt="" className={styles['thumbnail-origin']} />
                        <img
                          src={ebenumNews.ebenumMetaData?.ogImage}
                          alt=""
                          className={styles['thumbnail-background']}
                        />
                      </div>
                    )}
                    <div className={styles['og-info']}>
                      <div className={styles.summary}>
                        <strong>{ebenumNews.ebenumMetaData?.ogTitle}</strong>{' '}
                        <div className={styles.user}>
                          {ebenumNews.ebenumMetaData?.ownerAvatar ? (
                            <img src={ebenumNews.ebenumMetaData?.ownerAvatar} alt="" />
                          ) : (
                            <img src={ebenumNews.ebenumMetaData?.pressAvatar} alt="" />
                          )}
                          <div className={styles['user-info']}>
                            <cite>
                              {ebenumNews.ebenumMetaData?.ownerName
                                ? ebenumNews.ebenumMetaData?.ownerName
                                : ebenumNews.ebenumMetaData?.twitterCreator}
                            </cite>
                            {ebenumNews.ebenumMetaData?.datePublished ? (
                              <time dateTime={ebenumNews.ebenumMetaData?.datePublished}>
                                {FormatDate(ebenumNews.ebenumMetaData?.datePublished)}
                              </time>
                            ) : (
                              <time dateTime={ebenumNews.ebenumMetaData?.pressPublished}>
                                {FormatDate(`${ebenumNews.ebenumMetaData?.pressPublished}`)}
                              </time>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={styles.description}>
                        {ebenumNews.ebenumMetaData?.ogDescription}
                        ...
                      </div>
                    </div>
                  </div>
                )}
                <div className={styles.description}>
                  <p dangerouslySetInnerHTML={{ __html: ebenumNews.description.replace(/\n/g, '<br />') }} />
                </div>
              </PerfectScrollbar>
            </div>
          </>
        ) : (
          <header>
            <button type="button" className="close-btn" onClick={handleCloseModal}>
              <CrossButton />
              <span>닫기</span>
            </button>
            <h1>본문 불러오는 중</h1>
          </header>
        )}
      </article>
    </div>
  );
};

export default EbenumDetail;
