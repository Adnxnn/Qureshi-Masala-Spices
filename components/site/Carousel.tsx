'use client';

import { useRef, useState, ReactNode, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: ReactNode[];
  itemsToShow?: number;
  autoScrollInterval?: number; // New prop for auto-scroll interval in ms
}

export default function Carousel({ children, itemsToShow = 1, autoScrollInterval = 0 }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovered, setIsHovered] = useState(false); // State to track hover

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / itemsToShow;
      const newScrollLeft = direction === 'left' ? scrollRef.current.scrollLeft - scrollAmount : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });

      // Manually trigger handleScroll after smooth scroll, as it might not fire immediately
      setTimeout(handleScroll, 300); // Adjust timeout if needed
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      // A small tolerance (e.g., 1px) is used for checking the end of scroll
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  // Auto-scrolling effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScrollInterval > 0 && !isHovered) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          const scrollAmount = clientWidth / itemsToShow;

          // If at the end, loop back to the beginning
          if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scroll('right');
          }
        }
      }, autoScrollInterval);
    }

    return () => clearInterval(interval);
  }, [autoScrollInterval, isHovered, itemsToShow]);

  // Update arrow visibility on mount and resize
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        {children.map((child, index) => (
          <div key={index} className="flex-shrink-0 snap-center"
            style={{ width: `${100 / itemsToShow}%` }}>
            {child}
          </div>
        ))}
      </div>

      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full shadow-lg focus:outline-none z-10"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full shadow-lg focus:outline-none z-10"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}
