import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number; // em ms
  delay?: number;   // em ms
  y?: number;       // em px
  duration?: number;// em ms
  rootMargin?: string;
  threshold?: number;
  as?: keyof JSX.IntrinsicElements;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  stagger = 180,
  delay = 0,
  y = 32,
  duration = 1100,
  rootMargin = '0px 0px -22% 0px',
  threshold = 0.1,
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        });
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(el);

    // Se a intro estiver ativa, aguarda o término para permitir revelar
    if ((window as any).__introActive) {
      const handleIntro = () => {
        const currentRect = el.getBoundingClientRect();
        if (currentRect.top < window.innerHeight && currentRect.bottom > 0) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      };
      window.addEventListener('intro:complete', handleIntro, { once: true });
      return () => {
        window.removeEventListener('intro:complete', handleIntro);
        observer.disconnect();
      };
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  const childArray = React.Children.toArray(children);

  return React.createElement(
    Component,
    { ref: containerRef, className },
    childArray.map((child, index) => {
      if (!React.isValidElement(child)) return child;

      const itemDelay = delay + index * stagger;

      const style: React.CSSProperties = {
        ...(child.props.style || {}),
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${itemDelay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${itemDelay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      };

      return React.cloneElement(child, {
        style,
      } as any);
    })
  );
};

export default ScrollReveal;
