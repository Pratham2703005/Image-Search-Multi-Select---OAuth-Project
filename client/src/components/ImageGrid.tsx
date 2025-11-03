import React from 'react';
import '../styles/ImageGrid.css';

interface Image {
  id: string;
  url: string;
  thumb: string;
  description: string;
  photographer: string;
  photographerUrl: string;
}

interface ImageGridProps {
  images: Image[];
  selectedImages: Set<string>;
  onToggleSelect: (id: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, selectedImages, onToggleSelect }) => {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <div 
          key={image.id} 
          className={`image-card ${selectedImages.has(image.id) ? 'selected' : ''}`}
          onClick={() => onToggleSelect(image.id)}
        >
          <img src={image.thumb} alt={image.description} />
          <div className="image-overlay">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={selectedImages.has(image.id)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {image.description && (
              <div className="image-info">
                <p className="image-description">{image.description}</p>
                <p className="image-photographer">
                  by <a href={image.photographerUrl} target="_blank" rel="noopener noreferrer">
                    {image.photographer}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
