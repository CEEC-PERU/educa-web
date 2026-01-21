import React from 'react';

interface PdfPlayerProps {
  pdfSrc: string;
}

const PdfPlayer: React.FC<PdfPlayerProps> = ({ pdfSrc }) => {
  return (
    <div className="pdf-player-container">
      <iframe
        src={pdfSrc}
        className="w-full h-screen"
        title="PDF Player"
      ></iframe>
    </div>
  );
};

export default PdfPlayer;
