import React, { useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface Props {
  videoId: string;
  start?: number;
}

const YouTubePlayer = ({ videoId, start }: Props) => {
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
