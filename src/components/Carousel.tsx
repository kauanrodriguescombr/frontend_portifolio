import { useState, useEffect, ReactNode } from 'react';

interface CarouselProps {
  children: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel = ({ children, autoPlay = true, interval = 4000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = children.length;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      goToNext();
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, totalItems]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrevious();
    }
    setTouchStartX(null);
  };

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex;
    const normalizedDiff = ((diff % totalItems) + totalItems) % totalItems;

    if (normalizedDiff === 0) return 'center';
    if (normalizedDiff === 1 || normalizedDiff === totalItems - 1) {
      return normalizedDiff === 1 ? 'right' : 'left';
    }
    return 'hidden';
  };

  const getCardStyles = (position: string) => {
    const baseStyles = 'absolute top-1/2 transition-all duration-500 ease-out h-full ';

    switch (position) {
      case 'center':
        return `${baseStyles} left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 scale-100 opacity-100`;
      case 'left':
        return `${baseStyles} left-0 sm:left-[5%] -translate-y-1/2 z-20 scale-75 sm:scale-85 opacity-40 sm:opacity-60 cursor-pointer`;
      case 'right':
        return `${baseStyles} right-0 sm:right-[5%] -translate-y-1/2 z-20 scale-75 sm:scale-85 opacity-40 sm:opacity-60 cursor-pointer`;
      default:
        return `${baseStyles} left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 scale-50 opacity-0 pointer-events-none`;
    }
  };

  return (
    <div
      className="relative w-full h-[420px]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cards Container */}
      <div className="relative w-full h-full overflow-hidden">
        {children.map((child, index) => {
          const position = getCardPosition(index);
          return (
            <div
              key={index}
              onClick={() => {
                if (position === 'left') goToPrevious();
                if (position === 'right') goToNext();
              }}
              className={getCardStyles(position)}
              style={{
                width: 'min(90%, 390px)',
              }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
