import React, { useEffect } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import PageName from '@/components/PageName';
import EditorialItem from './item';
import styles from '@/styles/editorials.module.sass';

export default function Newsics() {
  const timestamp = Date.now();

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'editorials');
  }, []);

  return (
    <main className={styles.editorials}>
      <Seo
        pageTitles={`뉴직 - ${originTitle}`}
        pageTitle="뉴직"
        pageDescription="News & Music"
        pageImg={`https://nol2tr.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <PageName pageName="뉴직" />
      <div className={styles.list}>
        <EditorialItem />
      </div>
    </main>
  );
}
