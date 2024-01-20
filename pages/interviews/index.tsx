import React, { useEffect } from 'react';
import Seo, { originTitle } from '@/components/Seo';
import PageName from '@/components/PageName';
import ArticlesItem from './item';
import styles from '@/styles/articles.module.sass';

export default function Interviews() {
  const timestamp = Date.now();

  useEffect(() => {
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', 'articles');
  }, []);

  return (
    <main className={styles.articles}>
      <Seo
        pageTitles={`2인터뷰 - ${originTitle}`}
        pageTitle="2인터뷰"
        pageDescription="2인 인터뷰"
        pageImg={`https://memorial.dev1stud.io/og-image.png?ts=${timestamp}`}
      />
      <PageName pageName="2인터뷰" />
      <div className={styles.list}>
        <ArticlesItem />
      </div>
    </main>
  );
}
