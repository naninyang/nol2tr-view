import Image from 'next/image';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { mixIn, rem } from '@/styles/designSystem';
import { images } from './images';
import YouTubePlayer from './YouTubePlayer';

interface Props {
  videoId: string;
  start?: number;
  vi: string;
  mv?: boolean;
}

const Container = styled.div<{ mv?: boolean }>(({ mv }) => ({
  position: 'relative',
  overflow: 'hidden',
  '& img': {
    transition: 'all .4s cubic-bezier(.4,0,.2,1)',
    display: 'block',
    aspectRatio: mv ? '1920 / 1080' : '360 / 360',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: rem(12),
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
    aspectRatio: mv ? '1920 / 1080' : '360 / 360',
    '& i': {
      transition: 'all .4s cubic-bezier(.4,0,.2,1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(244, 246, 250, .7)',
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
    borderRadius: rem(12),
    aspectRatio: mv ? '1920 / 1080' : '360 / 360',
    width: '100%',
    height: 'auto',
  },
}));

const YouTubeController = ({ videoId, start, vi, mv }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <Container mv={mv}>
      {!isPlaying ? (
        <>
          <Image
            src={vi === 'missing' ? '/missing.webp' : `https://i.ytimg.com/vi_webp/${videoId}/${vi}.webp`}
            width={mv ? 360 : 640}
            height={mv ? 360 : 480}
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
