import { hex, rem, mixIn, mq } from '@/styles/designSystem';
import styled from '@emotion/styled';
import Anchor from './Anchor';
import { images } from './images';

const Dev1studio = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.services.dev1studioLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.services.dev1studioDark}) no-repeat 50% 50%/contain`,
  },
});

const Github = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.services.githubLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.services.githubDark}) no-repeat 50% 50%/contain`,
  },
});

const Studio = styled.i({
  'body[data-theme="dark"] &': {
    background: `url(${images.services.studioLight}) no-repeat 50% 50%/contain`,
  },
  'body &, body[data-theme="light"] &': {
    background: `url(${images.services.studioDark}) no-repeat 50% 50%/contain`,
  },
});

const Container = styled.footer({
  padding: `${rem(52)} ${rem(25)}`,
  'body[data-theme="dark"] &': {
    backgroundColor: hex.dark,
  },
  'body &, body[data-theme="light"] &': {
    backgroundColor: hex.light,
  },
});

const Contents = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(17),
  [mq.minMedium]: {
    gap: rem(32),
  },
});

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  '& div': {
    display: 'flex',
  },
  '& dl': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: rem(7),
    [mq.maxSmall]: {
      flexWrap: 'wrap',
      gap: rem(27),
    },
    [mq.minMedium]: {
      flexDirection: 'column',
    },
    '& > div': {
      alignItems: 'center',
      [mq.maxSmall]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: rem(3),
        width: `calc(50% - ${rem(27)})`,
        '&:nth-of-type(1)': {
          width: '100%',
        },
      },
      '& dt': {
        fontSize: rem(16),
        fontWeight: 800,
        'body[data-theme="dark"] &': {
          color: hex.light,
        },
        'body &, body[data-theme="light"] &': {
          color: hex.dark,
        },
        [mq.minMedium]: {
          width: rem(127),
          fontSize: rem(20),
        },
      },
      '& div': {
        gap: rem(2),
        [mq.maxSmall]: {
          flexDirection: 'column',
        },
        [mq.minMedium]: {
          gap: rem(17),
        },
        '& dd': {
          display: 'flex',
          fontSize: rem(14),
          fontWeight: 500,
          [mq.minMedium]: {
            gap: rem(17),
            fontSize: rem(16),
            '&::before': {
              content: '"/"',
              'body[data-theme="dark"] &': {
                color: hex.lightSummary,
              },
              'body &, body[data-theme="light"] &': {
                color: hex.darkSummary,
              },
            },
            '&:first-of-type::before': {
              display: 'none',
            },
          },
        },
      },
    },
  },
  '& a': {
    'body[data-theme="dark"] &': {
      color: hex.white,
    },
    'body &, body[data-theme="light"] &': {
      color: hex.black,
    },
    '&:focus, &:hover': {
      textDecoration: 'underline',
    },
  },
});

const Site = styled.div({
  display: 'flex',
  gap: rem(17),
  [mq.minMedium]: {
    gap: rem(23),
    paddingLeft: rem(12),
  },
  '& a': {
    display: 'block',
    '& i': {
      display: 'inline-block',
      width: rem(23),
      height: rem(23),
      [mq.minMedium]: {
        width: rem(27),
        height: rem(27),
      },
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
});

const Copyright = styled.div({
  '& p': {
    fontSize: rem(14),
    fontWeight: 400,
    'body[data-theme="dark"] &': {
      color: hex.light,
    },
    'body &, body[data-theme="light"] &': {
      color: hex.dark,
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

export default function Footer() {
  return (
    <Container>
      <Contents>
        <Content>
          <dl>
            <div>
              <dt>저작권 안내</dt>
              <div>
                <dd>
                  <Anchor href="/licenses">소스 저작권 안내</Anchor>
                </dd>
                <dd>
                  <Anchor href="/licenses">언론사의 권리</Anchor>
                </dd>
                <dd>
                  <Anchor href="/licenses">음원 및 뮤직비디오 저작권자의 권리</Anchor>
                </dd>
              </div>
            </div>
            <div>
              <dt>이용 안내</dt>
              <div>
                <dd>
                  <Anchor href="/usage">뉴스 및 음원</Anchor>
                </dd>
                <dd>
                  <Anchor href="/usage">유의사항</Anchor>
                </dd>
                <dd>
                  <Anchor href="/usage">놀이터뷰 소개</Anchor>
                </dd>
              </div>
            </div>
            <div>
              <dt>문의 및 공지</dt>
              <div>
                <dd>
                  <Anchor href="/notices">공지사항</Anchor>
                </dd>
                <dd>
                  <Anchor href="/contact-us">문의하기</Anchor>
                </dd>
                <dd>
                  <Anchor href="/open-sources">오픈소스</Anchor>
                </dd>
              </div>
            </div>
          </dl>
        </Content>
        <Site>
          <Anchor href="https://dev1stud.io">
            <Dev1studio />
            <span>데브런닷스튜디오</span>
          </Anchor>
          <Anchor href="https://github.com/naninyang/nol2tr-view">
            <Github />
            <span>놀이터뷰 깃헙 저장소</span>
          </Anchor>
        </Site>
        <Copyright>
          <p lang="en">
            &copy; Copyrights <Studio />
            <strong>DEV1L.studios</strong> <span>All rights reserved.</span>
          </p>
        </Copyright>
      </Contents>
    </Container>
  );
}
