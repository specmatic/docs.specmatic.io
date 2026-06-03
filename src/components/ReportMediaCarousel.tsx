import React, { useEffect, useState } from 'react';

type CarouselItem = {
  src: string;
  alt: string;
  label?: string;
};

type Props = {
  items: CarouselItem[];
};

function MediaSlide({ item, onOpenFullscreen}: { item: CarouselItem, onOpenFullscreen: () => void }) {
  return (
    <div className="report-media-carousel__slide report-media-carousel__slide--enter">
      <button
        type="button"
        onClick={onOpenFullscreen}
        className="report-media-carousel__frame"
        aria-label={`Open ${item.alt} fullscreen`}
      >
        <img alt={item.alt} className="report-media-carousel__image" src={item.src} />
        {item.label ? <div className="report-media-carousel__caption">{item.label}</div> : null}
      </button>
    </div>
  );
}

export function ReportMediaCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const closeFullscreen = () => setFullscreenIndex(null);
  const openFullscreen = () => setFullscreenIndex(index);

  useEffect(() => {
    setIndex(0);
    setFullscreenIndex(null);
  }, [items.length]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = window.setTimeout(() => setIsTransitioning(false), 180);
    return () => window.clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (fullscreenIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && closeFullscreen();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [fullscreenIndex]);

  if (items.length === 0) return null;
  const current = items[index];
  const hasMultiple = items.length > 1;
  const fullscreenItem = fullscreenIndex === null ? null : items[fullscreenIndex];

  return (
    <div className="report-media-carousel">
      <div className={`report-media-carousel__slideWrap${isTransitioning ? ' report-media-carousel__slideWrap--transitioning' : ''}`}>
        <MediaSlide item={current} onOpenFullscreen={openFullscreen} />
      </div>
      {hasMultiple ? (
        <div className="report-media-carousel__dots" aria-label="Carousel pagination">
          {items.map((item, itemIndex) => (
            <button
              type="button"
              key={item.src}
              aria-label={`Show ${item.alt}`}
              aria-pressed={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
              className={`report-media-carousel__dot${itemIndex === index ? ' report-media-carousel__dot--active' : ''}`}
            />
          ))}
        </div>
      ) : null}
      {fullscreenItem ? (
        <div
          className="report-media-carousel__fullscreen"
          role="dialog"
          aria-modal="true"
          onClick={closeFullscreen}
          aria-label={fullscreenItem.alt}
        >
          <div className="report-media-carousel__fullscreenShell" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeFullscreen}
              aria-label="Close fullscreen view"
              className="report-media-carousel__closeButton report-media-carousel__closeButton--floating"
            >
              Close
            </button>
            <div className="report-media-carousel__fullscreenMedia">
              <img alt={fullscreenItem.alt} src={fullscreenItem.src} className="report-media-carousel__fullscreenImage" />
            </div>
            {fullscreenItem.label ? (<div className="report-media-carousel__fullscreenCaption">{fullscreenItem.label}</div>) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
