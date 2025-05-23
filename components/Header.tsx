import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isIOS } from 'react-device-detect';
import styled from '@emotion/styled';
import Anchor from './Anchor';
import { hex, mixIn, rem } from '@/styles/designSystem';
import {
  HomeDownloadDefaultAfter,
  HomeDownloadDefaultBefore,
  HomeDownloadHoverAfter,
  HomeDownloadHoverBefore,
  LogoDark,
  Logolight,
  MiscClose,
  MiscMenuDark,
  MiscMenuLight,
  ModeDarkNighttime,
  ModeLightDaytime,
  ServicesDev1studioDark,
  ServicesDev1studioLight,
  ServicesDevelogDark,
  ServicesDevelogLight,
  ServicesGithubDark,
  ServicesGithubLight,
  ServicesStudioDark,
  ServicesStudioLight,
  ServicesVelogDark,
  ServicesVelogLight,
} from './images';

const Container = styled.header({
  backgroundColor: 'var(--bg-primary-opacity)',
  backdropFilter: `saturate(180%) blur(${rem(20)})`,
  WebkitBackdropFilter: `saturate(180%) blur(${rem(20)})`,
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1030,
  display: 'flex',
  justifyContent: 'space-between',
  padding: `
    calc(env(safe-area-inset-top) + ${rem(10)})
    calc(env(safe-area-inset-right) + ${rem(25)})
    ${rem(10)}
    calc(env(safe-area-inset-left) + ${rem(25)})
  `,
  width: '100%',
});

const ThemeChangeButton = styled.button<{ themeMode?: boolean }>(({ themeMode }) => ({
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  backgroundSize: `${rem(20)} ${rem(20)}`,
  backgroundImage: themeMode ? `url(${ModeDarkNighttime.src})` : `url(${ModeLightDaytime.src})`,
}));

const Primary = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: rem(7),
  '& h1': {
    '& a, & button': {
      backgroundColor: 'transparent',
      display: 'block',
      width: rem(77),
      height: rem(30),
      'body[data-theme="dark"] &': {
        background: `url(${Logolight.src}) no-repeat 50% 50%/contain`,
      },
      'body &, body[data-theme="light"] &': {
        background: `url(${LogoDark.src}) no-repeat 50% 50%/contain`,
      },
      '& span': {
        ...mixIn.screenReaderOnly,
      },
    },
  },
  '& button': {
    display: 'block',
    border: 0,
    borderRadius: rem(25),
    width: rem(25),
    height: rem(25),
    'body[data-theme="dark"] &': {
      backgroundColor: hex.darkBackground,
    },
    'body &, body[data-theme="light"] &': {
      backgroundColor: hex.lightBackground,
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
});

const Secondary = styled.div();

const MenuButton = styled.button({
  display: 'flex',
  transition: 'background-color .4s cubic-bezier(.4,0,.2,1)',
  backgroundColor: 'var(--default-bg)',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border)',
  borderRadius: rem(5),
  width: rem(30),
  height: rem(30),
  '& i': {
    display: 'inline-block',
    width: rem(25),
    height: rem(25),
    'body[data-theme="dark"] &': {
      background: `url(${MiscMenuLight.src}) no-repeat 50% 50%/contain`,
    },
    'body &, body[data-theme="light"] &': {
      background: `url(${MiscMenuDark.src}) no-repeat 50% 50%/contain`,
    },
  },
  '& span': {
    ...mixIn.screenReaderOnly,
  },
});

const Menu = styled.nav({
  position: 'fixed',
  zIndex: '1070',
  top: 0,
  left: 0,
  inset: '0px',
  display: 'flex',
  width: '100%',
  height: '100dvh',
  transition: 'all .4s cubic-bezier(.4,0,.2,1)',
  background: 'rgba(0, 0, 0, .9)',
  opacity: 0,
  '&.expanded': {
    opacity: 1,
  },
});

const MenuContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(15),
  backgroundColor: 'var(--default-bg)',
  transition: 'all .4s cubic-bezier(.4,0,.2,1)',
  transform: `translateX(${rem(270)})`,
  opacity: 0,
  padding: `calc(env(safe-area-inset-top) + ${rem(10)}) calc(env(safe-area-inset-right) + ${rem(
    25,
  )}) calc(env(safe-area-inset-bottom) + ${rem(25)}) calc(env(safe-area-inset-right) + ${rem(25)})`,
  width: rem(320),
  '.expanded &': {
    transform: `translateX(0)`,
    opacity: 1,
  },
  '& ol.primary': {
    display: 'flex',
    flexDirection: 'column',
    gap: rem(10),
    flexGrow: '1',
    padding: `0 ${rem(10)}`,
    '& li': {
      '& a': {
        position: 'relative',
        display: 'block',
        padding: `${rem(10)} 0`,
        fontSize: rem(20),
        fontWeight: '700',
        color: 'var(--txt-blockquote)',
        transition: 'all .4s cubic-bezier(.4,0,.2,1)',
        '&::before': {
          content: "''",
          display: 'block',
          position: 'absolute',
          opacity: 0,
          bottom: 0,
          left: 0,
          width: 0,
          height: rem(2),
          transition: 'all .4s cubic-bezier(.4,0,.2,1)',
        },
        '&:hover, &:focus': {
          color: hex.accent,
          '&::before': {
            backgroundColor: hex.accent,
            opacity: 1,
            width: '100%',
          },
        },
      },
      '& button': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: rem(2),
        transition: 'all .4s cubic-bezier(.4,0,.2,1)',
        background: 'transparent',
        marginTop: rem(20),
        border: `1px solid ${hex.accent}`,
        borderRadius: rem(5),
        padding: `${rem(10)} 0`,
        width: '100%',
        fontSize: rem(16),
        fontWeight: 700,
        color: hex.accent,
        '& s': {
          display: 'block',
          position: 'relative',
          width: rem(22),
          height: rem(22),
        },
        '& i': {
          transition: 'all .4s cubic-bezier(.4,0,.2,1)',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
          width: rem(22),
          height: rem(22),
        },
        '&:focus, &:hover': {
          background: hex.accent,
          color: hex.white,
        },
        '& .before': {
          background: `url(${HomeDownloadDefaultBefore.src}) no-repeat 50% 50%/contain`,
        },
        '&:hover, &:focus': {
          '& .before': {
            background: `url(${HomeDownloadHoverBefore.src}) no-repeat 50% 50%/contain`,
          },
        },
        '&.before': {
          '& .after': {
            background: `url(${HomeDownloadDefaultAfter.src}) no-repeat 50% 50%/contain`,
          },
          '&:hover, &:focus': {
            '& .after': {
              background: `url(${HomeDownloadHoverAfter.src}) no-repeat 50% 50%/contain`,
            },
          },
        },
        '&.after': {
          '& .after': {
            top: rem(-5),
            background: `url(${HomeDownloadDefaultAfter.src}) no-repeat 50% 50%/contain`,
          },
          '&:hover, &:focus': {
            '& .after': {
              background: `url(${HomeDownloadHoverAfter.src}) no-repeat 50% 50%/contain`,
            },
          },
        },
      },
    },
  },
  '& ol.secondary': {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: rem(12),
    paddingBottom: rem(17),
    '& li': {
      display: 'flex',
      gap: rem(12),
      '&::before': {
        content: "'/'",
        color: 'var(--border)',
      },
      '&:first-of-type::before': {
        display: 'none',
      },
      '& a': {
        color: 'var(--bg-reverse-opacity)',
        '&:hover, &:focus': {
          textDecoration: 'underline',
        },
      },
    },
  },
  '& ul': {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: rem(5),
    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: rem(25),
      height: rem(25),
      '& i': {
        display: 'inline-block',
        width: rem(20),
        height: rem(20),
      },
      '& span': {
        ...mixIn.screenReaderOnly,
      },
    },
  },
  '& p': {
    fontSize: rem(14),
    textAlign: 'right',
    'body[data-theme="dark"] &': {
      color: 'rgba(255, 255, 255, .5)',
    },
    'body &, body[data-theme="light"] &': {
      color: 'rgba(0, 0, 0, .5)',
    },
    '& strong': {
      ...mixIn.screenReaderOnly,
    },
    '& i': {
      display: 'inline-block',
      aspectRatio: '385 / 50',
      height: rem(14),
    },
  },
});

const Close = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  '& button': {
    background: 'none',
    width: rem(30),
    height: rem(30),
    '& i': {
      background: `url(${MiscClose.src}) no-repeat 50% 50%/contain`,
      display: 'inline-block',
      width: rem(27),
      height: rem(27),
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
});

const Develog = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${ServicesDevelogLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ServicesDevelogDark.src}) no-repeat 50% 50%/contain`,
  },
});

const Velog = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${ServicesVelogLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ServicesVelogDark.src}) no-repeat 50% 50%/contain`,
  },
});

const Dev1studio = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${ServicesDev1studioLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ServicesDev1studioDark.src}) no-repeat 50% 50%/contain`,
  },
});

const Github = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${ServicesGithubLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ServicesGithubDark.src}) no-repeat 50% 50%/contain`,
  },
});

const Studio = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${ServicesStudioLight.src}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${ServicesStudioDark.src}) no-repeat 50% 50%/contain`,
  },
});

const Dimmed = styled.div({
  ...mixIn.col,
});

export default function Header() {
  const [themeMode, setThemeMode] = useState<string>('light');
  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'light';
    setThemeMode(systemTheme);
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (!savedTheme || (savedTheme !== 'light' && savedTheme !== 'dark')) {
      window.localStorage.setItem('theme', 'light');
    } else {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.dataset.theme = themeMode;
    window.localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const themeModeHandle = (event: React.MouseEvent) => {
    event.preventDefault();
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const [ios, setIos] = useState<string>();
  useEffect(() => {
    if (isIOS) {
      setIos('isIOS');
    }
  }, []);

  const [menuState, setMenuState] = useState<'closed' | 'expanding' | 'expanded'>('closed');

  const openMenu = () => {
    setMenuState('expanding');
    setTimeout(() => setMenuState('expanded'), 400);
  };

  const closeMenu = () => {
    setMenuState('expanding');
    setTimeout(() => {
      setMenuState('closed');
    }, 400);
  };

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (menuState !== 'closed') {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    } else if (menuState === 'closed') {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [menuState]);

  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const onInstallPWA = () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as any;
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const [buttonClass, setButtonClass] = useState('before');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setButtonClass((prevClass) => (prevClass === 'before' ? 'after' : 'before'));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const router = useRouter();
  return (
    <>
      <Container>
        {router.pathname === '/' || router.pathname === '/interviews' || router.pathname === '/newsics' ? undefined : (
          <s />
        )}
        <Primary>
          <h1>
            <Anchor href="/">
              <span>놀이터뷰 nol2tr_view</span>
            </Anchor>
          </h1>
          <ThemeChangeButton type="button" themeMode={themeMode === 'dark'} onClick={themeModeHandle}>
            {themeMode === 'dark' ? <span>라이트 모드로 변경</span> : <span>라이트 모드로 변경</span>}
          </ThemeChangeButton>
        </Primary>
        <Secondary>
          <MenuButton type="button" onClick={openMenu}>
            <i />
            <span>메뉴 열기</span>
          </MenuButton>
        </Secondary>
      </Container>
      {menuState !== 'closed' && (
        <Menu
          className={`${menuState === 'expanding' ? 'expanding' : ''} ${menuState === 'expanded' ? 'expanded' : ''}`}
        >
          <Dimmed onClick={closeMenu} />
          <MenuContainer>
            <Close>
              <button type="button" onClick={closeMenu}>
                <i />
                <span>메뉴 닫기</span>
              </button>
            </Close>
            <ol className="primary">
              <li>
                <Anchor href={ios === 'isIOS' ? '/musics-ios' : '/musics'} onClick={closeMenu}>
                  선곡표
                </Anchor>
              </li>
              <li>
                <Anchor href="/notices" onClick={closeMenu}>
                  안내사항
                </Anchor>
              </li>
              <li>
                <Anchor href="/contact-us" onClick={closeMenu}>
                  문의사항
                </Anchor>
              </li>
              <li>
                <Anchor href="/open-sources" onClick={closeMenu}>
                  오픈소스
                </Anchor>
              </li>
              {deferredPrompt && (
                <li>
                  <button type="button" className={buttonClass} onClick={onInstallPWA}>
                    <span>놀이터뷰 앱 내려받기</span>
                    <s>
                      <i className="before" />
                      <i className="after" />
                    </s>
                  </button>
                </li>
              )}
            </ol>
            <ol className="secondary">
              <li>
                <Anchor href="licenses">저작권 안내</Anchor>
              </li>
              <li>
                <Anchor href="usage">이용 안내</Anchor>
              </li>
            </ol>
            <ul>
              <li>
                <Anchor href="https://dev1stud.io">
                  <Dev1studio />
                  <span>데브런닷스튜디오</span>
                </Anchor>
              </li>
              <li>
                <Anchor href="https://develog.dev1stud.io">
                  <Develog />
                  <span>디벨로그</span>
                </Anchor>
              </li>
              <li>
                <Anchor href="https://velog.io/@naninyang">
                  <Velog />
                  <span>벨로그</span>
                </Anchor>
              </li>
              <li>
                <Anchor href="https://github.com/naninyang/nol2tr-view">
                  <Github />
                  <span>깃헙 저장소</span>
                </Anchor>
              </li>
            </ul>
            <p>
              &copy; <Studio />
              <strong>DEV1L.studios</strong>. 2024.
            </p>
          </MenuContainer>
        </Menu>
      )}
    </>
  );
}
