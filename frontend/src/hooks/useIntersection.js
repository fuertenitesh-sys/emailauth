import { useState, useEffect, useRef } from 'react';

export const useIntersection = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Default to true for mobile devices or browsers that don't support it to ensure it works
    if (!window.IntersectionObserver) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { rootMargin: '50px', ...options });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.rootMargin, options.threshold]);

  return [ref, isIntersecting];
};
