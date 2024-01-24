import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from '@emotion/styled';
import Seo, { originTitle } from '@/components/Seo';
import Anchor from '@/components/Anchor';
import { images } from '@/components/images';
import content from '@/styles/Content.module.sass';
import styles from '@/styles/Contact.module.sass';

const BackButton = styled.i({
  display: 'block',
  'body[data-theme="dark"] &': {
    background: `url(${images.arrow.backLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.arrow.backDark}) no-repeat 50% 50%/contain`,
  },
});

function ContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: '',
    guestName: '',
    guestEmail: '',
    content: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/contact`, formData);
      if (response.status === 200) {
        alert('제출 완료되었어요. 감사합니다.');
        router.push('/');
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [currentPage, setCurrentPage] = useState<string | null>(null);

  useEffect(() => {
    const storedPage = localStorage.getItem('currentPage');
    setCurrentPage(storedPage);
  }, []);

  const timestamp = Date.now();

  return (
    <main className={`${content.content} ${styles.contact_us}`}>
      <Seo
        pageTitles={`문의사항 - ${originTitle}`}
        pageTitle="문의사항"
        pageDescription="무엇이든 물어보세요"
        pageImg={`https://nol2tr.dev1stud.io/og-image.webp?ts=${timestamp}`}
      />
      <div className="top-link">
        {currentPage ? (
          <Anchor href={`/${currentPage}`}>
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        ) : (
          <Anchor href="/">
            <BackButton />
            <span>뒤로가기</span>
          </Anchor>
        )}
      </div>
      <div className={styles['contact_us-content']}>
        <h1>
          <span>문의사항 Contact Us.</span>
        </h1>
        <div>
          <p>오타, 탈자, 버그 등 발견시 수정 요청해 주세요</p>
          <p>도움을 주시는 모든 분들께 감사의 말씀을 올립니다. 🥰</p>
          <p>
            <span>모든 항목은 필수 입력입니다.</span> 이름과 이메일은 답변 목적으로만 사용됩니다.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>문의 질의</legend>
            <input
              required
              type="hidden"
              value={formData.createdAt}
              onChange={(e) => setFormData({ ...formData, createdAt: e.target.value })}
            />
            <input
              required
              type="hidden"
              value={formData.updatedAt}
              onChange={(e) => setFormData({ ...formData, updatedAt: e.target.value })}
            />
            <input
              required
              type="hidden"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
            />
            <div className={styles['field-group']}>
              <label htmlFor="subject">제목</label>
              <input
                required
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="guestName">이름</label>
              <input
                required
                type="text"
                id="guestName"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="guestEmail">이메일</label>
              <input
                required
                type="email"
                id="guestEmail"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              />
            </div>
            <div className={styles['field-group']}>
              <label htmlFor="content">내용</label>
              <textarea
                required
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <button type="submit">문의하기</button>
          </fieldset>
        </form>
      </div>
    </main>
  );
}

export default ContactForm;
