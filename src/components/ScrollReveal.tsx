import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  stagger = 0.1,
  delay = 0,
  y = 16,
  duration = 0.65,
  start = 'top 88%',
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respeita acessibilidade caso o usuário prefira redução de movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ctx: gsap.Context | null = null;

    const setupAnimation = () => {
      const items = el.children.length > 0 ? Array.from(el.children) : [el];

      ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          {
            opacity: 0,
            y,
          },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            stagger,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
            clearProps: 'transform,opacity',
          }
        );
      }, el);
    };

    // Se a intro da página estiver ativa, aguarda a conclusão para sincronizar a viewport
    if ((window as any).__introActive) {
      const handleIntro = () => {
        setupAnimation();
        ScrollTrigger.refresh();
      };
      window.addEventListener('intro:complete', handleIntro, { once: true });
      return () => {
        window.removeEventListener('intro:complete', handleIntro);
        if (ctx) ctx.revert();
      };
    }

    setupAnimation();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [stagger, delay, y, duration, start]);

  return React.createElement(
    Component,
    { ref: containerRef, className },
    children
  );
};

export default ScrollReveal;
