import styled from '@emotion/styled';
import { images } from '@/components/images';
import styles from '@/styles/Article.module.sass';

const WarningIcon = styled.i({
  background: `url(${images.misc.warning}) no-repeat 50% 50%/contain`,
});

const ReportVideo = ({ videoId }: { videoId: string }) => {
  const handleReport = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const jejeupVideo = event.currentTarget.getAttribute('data-video');

    try {
      const response = await fetch('/api/unpublish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jejeupVideo: jejeupVideo }),
      });

      if (response.ok) {
        alert('신고 성공! 감사합니다 ☺️');
      } else {
        const errorData = await response.json();
        console.log(errorData.error);
        alert('서버 오류입니다. 잠시 뒤 다시 시도해 주세요 😭');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류입니다. 잠시 뒤 다시 시도해 주세요 😭');
    }
  };

  return (
    <p className={styles['report-video']}>
      <WarningIcon />
      유튜브 영상에 문제가 있을 때는{' '}
      <button type="button" onClick={handleReport} data-video={videoId}>
        제보
      </button>
      해 주세요. 알려주시면 문제가 없는 영상으로 교체합니다.
    </p>
  );
};

export default ReportVideo;
