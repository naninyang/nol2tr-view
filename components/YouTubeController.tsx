import Image from 'next/image';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { mixIn, rem } from '@/styles/designSystem';
import { images } from './images';
import YouTubePlayer from './YouTubePlayer';

interface Props {
  videoId: string;
  start?: number;
  vi: string;
}

const Container = styled.div<{ isDesktop?: boolean }>(({ isDesktop }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&:hover img': {
    transform: isDesktop ? 'scale(1.02)' : undefined,
  },
  '& img': {
    transition: 'all .4s cubic-bezier(.4,0,.2,1)',
    display: 'block',
    aspectRatio: '1920 / 1080',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    ...mixIn.imageRendering,
  },
  '& > button': {
    display: 'flex',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    border: 0,
    height: '100%',
    aspectRatio: '1920 / 1080',
    '&:hover i': {
      opacity: isDesktop ? 1 : undefined,
    },
    '& i': {
      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(244, 246, 250, .7)',
      opacity: isDesktop ? 0 : undefined,
      borderRadius: rem(52),
      width: rem(52),
      height: rem(52),
      '&::before': {
        content: "''",
        display: 'block',
        width: rem(36),
        height: rem(36),
        background: `url(${images.misc.play}) no-repeat 50% 50%/contain`,
      },
    },
    '& span': {
      ...mixIn.screenReaderOnly,
    },
  },
  '& div': {
    width: '100%',
    height: '100%',
  },
  '& iframe': {
    border: 0,
    aspectRatio: '1920 / 1080',
    width: '100%',
    height: 'auto',
  },
}));

const YouTubeController = ({ videoId, start, vi }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Container isDesktop={isDesktop}>
      {!isPlaying ? (
        <>
          <Image
            src={vi === 'missing' ? '/missing.webp' : `https://i.ytimg.com/vi_webp/${videoId}/${vi}.webp`}
            width={640}
            height={480}
            unoptimized
            priority
            alt=""
          />
          <button type="button" onClick={handlePlay}>
            <i />
            <span>영상 재생하기</span>
          </button>
        </>
      ) : (
        <YouTubePlayer videoId={videoId} start={start} />
      )}
    </Container>
  );
};

export default YouTubeController;
