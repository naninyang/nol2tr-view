import React, { useRef } from 'react';
import styled from '@emotion/styled';
import YouTube, { YouTubeProps } from 'react-youtube';
import { rem } from '@/styles/designSystem';

interface Props {
  videoId: string;
  start?: number;
}

const Controllers = styled.div({
  '& strong': {
    display: 'block',
    padding: `${rem(5)} ${rem(15)}`,
    fontSize: rem(14),
    fontWeight: '700',
    color: 'var(--default-text)',
  },
  '& button': {
    backgroundColor: 'transparent',
    width: '100%',
    padding: `${rem(1)} ${rem(15)}`,
    textAlign: 'left',
    '& span': {
      maxWidth: '100%',
      padding: `${rem(2)} 0`,
      display: 'inline-block',
      borderBottom: '1px solid var(--border)',
      color: 'var(--txt-subject)',
      fontSize: rem(12),
      lineHeight: 1.5,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
  },
});

const YouTubePlayer = ({ videoId, start }: Props) => {
  const playerRef = useRef<any>(null);

  const opts: YouTubeProps['opts'] = {
    width: 560,
    height: 315,
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      start: start,
    },
  };

  return (
    <>
      <YouTube videoId={videoId} opts={opts} />
    </>
  );
};

export default YouTubePlayer;
