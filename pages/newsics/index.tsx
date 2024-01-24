import React, { useEffect } from 'react';
import ArticlesItem from './item';
import Seo, { originTitle } from '@/components/Seo';
import PageName from '@/components/PageName';
import styles from '@/styles/Newsics.module.sass';

export default function Newsics() {
  const timestamp = Date.now();

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'newsics');
  }, []);

  return (
    <main className={styles.articles}>
      <Seo
        pageTitles={`뉴직 - ${originTitle}`}
        pageTitle="뉴직"
        pageDescription="News & Music"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <PageName pageName="뉴직" />
      <div className={styles.list}>
        <ArticlesItem />
      </div>
    </main>
  );
}
