import React, { useEffect } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import PageName from '@/components/PageName';
import WatchesNews from './item';
import styles from '@/styles/watches.module.sass';

export default function Ebenums() {
  const timestamp = Date.now();

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'watches');
  }, []);

  return (
    <main className={styles.watches}>
      <Seo
        pageTitles={`클릭해보니 - ${originTitle}`}
        pageTitle="클릭해보니"
        pageDescription="대신클릭해드림"
        pageImg={`https://memorial.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <PageName pageName="클릭해보니" />
      <div className={styles.list}>
        <WatchesNews />
      </div>
    </main>
  );
}
