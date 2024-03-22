import React from 'react';
import Anchor from './Anchor';
import styles from '@/styles/Pagination.module.sass';

export function Pagination({
  sorting,
  category,
  currentPage,
  pageCount,
}: {
  sorting: string;
  category?: string;
  currentPage: number;
  pageCount: number;
}) {
  const pageLimit = 5;
  const currentGroup = Math.floor((currentPage - 1) / pageLimit);

  const startPage = currentGroup * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, pageCount);

  const prevGroupPage = startPage - 1;
  const nextGroupPage = endPage + 1;

  return (
    <div className={styles.pagination}>
      {currentGroup > 0 && (
        <div className={styles.pager}>
          {sorting === 'interviews' ? (
            <Anchor href={`/interviews?category=${category}&page=${prevGroupPage}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 2.46484L1.46484 6L5 9.53516L5.75 8.78516L3.46484 6.5H10.5V5.5H3.46484L5.75 3.21484L5 2.46484Z"
                  fill="black"
                />
              </svg>
              <span>이전</span>
            </Anchor>
          ) : (
            <Anchor href={`/newsics?page=${prevGroupPage}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 2.46484L1.46484 6L5 9.53516L5.75 8.78516L3.46484 6.5H10.5V5.5H3.46484L5.75 3.21484L5 2.46484Z"
                  fill="black"
                />
              </svg>
              <span>이전</span>
            </Anchor>
          )}
        </div>
      )}
      {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
        const pageNumber = startPage + i;
        return (
          <React.Fragment key={pageNumber}>
            <div className={`${styles.pages} ${pageNumber === currentPage ? styles.current : ''}`}>
              {sorting === 'interviews' ? (
                <Anchor href={`/interviews?category=${category}&page=${pageNumber}`}>{pageNumber}</Anchor>
              ) : (
                <Anchor href={`/newsics?page=${pageNumber}`}>{pageNumber}</Anchor>
              )}
            </div>
          </React.Fragment>
        );
      })}
      {currentGroup < Math.ceil(pageCount / pageLimit) - 1 && (
        <div className={styles.pager}>
          {sorting === 'interviews' ? (
            <Anchor href={`/interviews?category=${category}&page=${nextGroupPage}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 2.46484L6.25 3.21484L8.53516 5.5H1.5V6.5H8.53516L6.25 8.78516L7 9.53516L10.5352 6L7 2.46484Z"
                  fill="black"
                />
              </svg>
              <span>다음</span>
            </Anchor>
          ) : (
            <Anchor href={`/newsics?page=${nextGroupPage}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7 2.46484L6.25 3.21484L8.53516 5.5H1.5V6.5H8.53516L6.25 8.78516L7 9.53516L10.5352 6L7 2.46484Z"
                  fill="black"
                />
              </svg>
              <span>다음</span>
            </Anchor>
          )}
        </div>
      )}
    </div>
  );
}
