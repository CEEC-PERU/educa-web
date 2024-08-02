import React from 'react';

interface SlideProps {
  title: string;
  content: React.ReactNode;
  audioSrc?: string;
}

const Slide: React.FC<SlideProps> = ({ title, content, audioSrc }) => {
  return (
    <div className="slide">
      <h2>{title}</h2>
      {content}
      {audioSrc && <audio controls src={audioSrc}></audio>}
    </div>
  );
};

export default Slide;