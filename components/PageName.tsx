import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { mq, rem } from '@/styles/designSystem';
import {
  TabInterviewDefaultDark,
  TabInterviewDefaultLight,
  TabNewsicDefaultDark,
  TabNewsicDefaultLight,
  TabPlaylistDefaultDark,
  TabPlaylistDefaultLight,
} from './images';

interface Props {
  pageName: string;
}

const Container = styled.h2({
  display: 'flex',
  alignItems: 'center',
  gap: rem(5),
  padding: `${rem(15)} 0`,
  fontSize: rem(20),
  color: 'var(--default-text)',
  [mq.minSmall]: {
    padding: `${rem(15)} 0`,
  },
  '& span': {
    lineHeight: 1,
  },
  '& i': {
    display: 'block',
    width: rem(25),
    height: rem(25),
    '&[data-page="/interviews"]': {
      'body[data-theme="dark"] &': {
        background: `url(${TabInterviewDefaultLight.src}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${TabInterviewDefaultDark.src}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/newsics"]': {
      'body[data-theme="dark"] &': {
        background: `url(${TabNewsicDefaultLight.src}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${TabNewsicDefaultDark.src}) no-repeat 50% 50%/contain`,
      },
    },
    '&[data-page="/playlists"]': {
      'body[data-theme="dark"] &': {
        background: `url(${TabPlaylistDefaultLight.src}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${TabPlaylistDefaultDark.src}) no-repeat 50% 50%/contain`,
      },
    },
  },
});

const PageName = ({ pageName }: Props) => {
  const router = useRouter();
  return (
    <Container>
      <i data-page={router.pathname} /> <span>{pageName}</span>
    </Container>
  );
};

export default PageName;
