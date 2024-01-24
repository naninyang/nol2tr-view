import React, { useEffect } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import PageName from '@/components/PageName';
import WatchesNews from './item';
import styles from '@/styles/Ebenums.module.sass';

export default function Ebenums() {
  const timestamp = Date.now();

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'ebenums');
  }, []);

  return (
    <main className={styles.ebenums}>
      <Seo
        pageTitles={`노클노플 - ${originTitle}`}
        pageTitle="노클노플"
        pageDescription="노 클릭, 노 플레이"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <PageName pageName="노클노플" />
      <div className={styles.list}>
        <WatchesNews />
      </div>
    </main>
  );
}
