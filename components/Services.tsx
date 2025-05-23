import styled from '@emotion/styled';
import Anchor from './Anchor';
import { hex, rem, mixIn } from '@/styles/designSystem';
import { useRouter } from 'next/router';
import {
  TabInterviewActive,
  TabInterviewDark,
  TabInterviewLight,
  TabNewsicActive,
  TabNewsicDark,
  TabNewsicLight,
  TabPlaylistActive,
  TabPlaylistdark,
  TabPlaylistLight,
} from './images';

const Nav = styled.nav({
  position: 'fixed',
  bottom: 0,
  left: 0,
  display: 'flex',
  zIndex: 1020,
  justifyContent: 'center',
  backdropFilter: `saturate(180%) blur(${rem(20)})`,
  backgroundColor: 'var(--bg-primary-opacity)',
  width: '100%',
  '&::before': {
    content: "''",
    position: 'absolute',
    top: 0,
    display: 'block',
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--border)',
  },
  '& ol': {
    display: 'flex',
    marginBottom: 'env(safe-area-inset-bottom)',
    width: '100%',
  },
  '& li': {
    ...mixIn.col,
  },
  '& a': {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: rem(2),
    padding: `${rem(7)} 0`,
    textAlign: 'center',
    '& i': {
      display: 'inline-block',
      width: rem(20),
      height: rem(20),
      '&[data-icon="playlist"]': {
        'body[data-theme="dark"] &': {
          background: `url(${TabPlaylistLight.src}) no-repeat 50% 50%/contain`,
        },
        'body &, body[data-theme="light"] &': {
          background: `url(${TabPlaylistdark.src}) no-repeat 50% 50%/contain`,
        },
      },
      '&[data-icon="interview"]': {
        'body[data-theme="dark"] &': {
          background: `url(${TabInterviewLight.src}) no-repeat 50% 50%/contain`,
        },
        'body &, body[data-theme="light"] &': {
          background: `url(${TabInterviewDark.src}) no-repeat 50% 50%/contain`,
        },
      },
      '&[data-icon="newsic"]': {
        'body[data-theme="dark"] &': {
          background: `url(${TabNewsicLight.src}) no-repeat 50% 50%/contain`,
        },
        'body &, body[data-theme="light"] &': {
          background: `url(${TabNewsicDark.src}) no-repeat 50% 50%/contain`,
        },
      },
    },
    '& span': {
      fontSize: rem(12),
      lineHeight: 1,
    },
  },
});

const MenuItem = styled.li<{ currentRouter?: boolean }>(({ currentRouter }) => ({
  '& a': {
    color: currentRouter ? hex.accent : 'var(--txt-subject)',
    fontWeight: currentRouter ? '900' : '400',
    '& i': {
      '&[data-icon="playlist"]': {
        background: currentRouter ? `url(${TabPlaylistActive.src}) no-repeat 50% 50%/contain !important` : undefined,
      },
      '&[data-icon="interview"]': {
        background: currentRouter ? `url(${TabInterviewActive.src}) no-repeat 50% 50%/contain !important` : undefined,
      },
      '&[data-icon="newsic"]': {
        background: currentRouter ? `url(${TabNewsicActive.src}) no-repeat 50% 50%/contain !important` : undefined,
      },
    },
  },
}));

export default function Services() {
  const router = useRouter();
  return (
    <Nav>
      <ol>
        <MenuItem
          currentRouter={router.pathname === '/interviews' || router.pathname.includes('/interview') ? true : false}
        >
          <Anchor href="/interviews">
            <i data-icon="interview" />
            <span>2nterview</span>
          </Anchor>
        </MenuItem>
        <MenuItem currentRouter={router.pathname === '/newsics' || router.pathname.includes('/newsic') ? true : false}>
          <Anchor href="/newsics">
            <i data-icon="newsic" />
            <span>Newsic</span>
          </Anchor>
        </MenuItem>
        <MenuItem
          currentRouter={router.pathname === '/playlists' || router.pathname.includes('/playlist') ? true : false}
        >
          <Anchor href="/playlists">
            <i data-icon="playlist" />
            <span>Playlist</span>
          </Anchor>
        </MenuItem>
      </ol>
    </Nav>
  );
}
