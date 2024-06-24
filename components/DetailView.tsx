// components/DetailView.tsx
import React from 'react';
import './../app/globals.css';

interface DetailViewProps {
  title: string;
  imageUrl?: string;
  details: { label?: string; value: string }[];
  videoUrl?: string;
}

const DetailView: React.FC<DetailViewProps> = ({ title, imageUrl, details, videoUrl }) => {
  return (
    <div className="max-w-4xl">
      <div className="flex space-x-4 mb-4">
        {imageUrl && (
          <div className="w-1/2 mt-4">
            <img src={imageUrl} alt={title} className="w-full rounded-lg" />
          </div>
        )}
        <div className="w-2/3">
          <h2 className="text-4xl font-bold mb-4 mt-4">{title}</h2>
          {details.map((detail, index) => (
            <div key={index} className="mb-4 text-lg"><strong>{detail.label}</strong> {detail.value}</div>
          ))}
        </div>
      </div>
      {videoUrl && (
        <div className="mb-4">
          <strong>Video de introducción:</strong>
          <div className="mt-8">
            <video src={videoUrl} controls className="w-full h-80 rounded-lg" /> {/* Altura del video */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailView;
