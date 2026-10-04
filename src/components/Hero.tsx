import React, { useEffect, useRef } from 'react';
import { MessageCircle, FolderOpen } from 'lucide-react';
import gsap from 'gsap';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);

  const fullSubtitle = 'Designer & Desenvolvedor de Sites';

  useEffect(() => {
    // Flag global gravada pelo App quando a intro está ativa
    const introIsActive = (window as any).__introActive === true;

    const runAnimation = () => {
      const ctx = gsap.context(() => {
        const chars = titleRef.current?.querySelectorAll('.hero-char');
        const tl = gsap.timeline();

        if (chars && chars.length > 0) {
          tl.from(
            chars,
            {
              opacity: 0,
              y: -40,
              scale: 0.95,
              filter: 'blur(1.8rem)',
              duration: 2,
              stagger: 0.09,
              ease: 'power3.out',
              clearProps: 'transform,opacity,filter',
            },
            0
          );
        }

        if (subtitleRef.current) {
          subtitleRef.current.textContent = '';
          const progress = { count: 0 };

          tl.to(
            progress,
            {
              count: fullSubtitle.length,
              duration: 3,
              ease: 'none',
              onUpdate: () => {
                if (subtitleRef.current) {
                  subtitleRef.current.textContent = fullSubtitle.slice(
                    0,
                    Math.round(progress.count)
                  );
                }
              },
              onComplete: () => {
                if (subtitleRef.current) {
                  subtitleRef.current.textContent = fullSubtitle;
                }
              },
            },
            0
          );
        }
      }, containerRef);

      return () => ctx.revert();
    };

    if (!introIsActive) {
      // Sem intro ativa: roda imediatamente
      return runAnimation();
    }

    // Com intro ativa: aguarda o sinal de conclusão
    const handler = () => runAnimation();
    window.addEventListener('intro:complete', handler, { once: true });
    return () => window.removeEventListener('intro:complete', handler);
  }, []);

  const lines = ['Kauan', 'Rodrigues'];

  return (
    <section className="hero-section min-h-screen flex items-center justify-center lg:justify-start relative overflow-hidden pt-20 pb-8">
      <div ref={containerRef} className="section-container w-full mx-auto lg:!ml-9 px-6 sm:px-10 lg:!p-0 relative z-10 flex flex-col items-center lg:items-start">
        <div className="w-full text-center lg:text-left flex flex-col items-center lg:items-start">

          <h1
            ref={titleRef}
            aria-label="Kauan Rodrigues"
            className="!leading-[80%] uppercase font-heading text-foreground mb-4 text-center lg:text-left w-full"
            style={{ fontSize: 'clamp(2.5rem, min(18vw, 28vh), 22rem)' }}
          >
            {lines.map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                <span className="inline-block whitespace-nowrap">
                  {line.split('').map((char, charIndex) => (
                    <span
                      key={charIndex}
                      className="hero-char inline-block will-change-[transform,opacity,filter]"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </span>
              </React.Fragment>
            ))}
          </h1>

          <p className="font-body text-xl sm:text-2xl md:text-3xl text-foreground/90 mb-10 flex items-center justify-center lg:justify-start min-h-[2rem]">
            <span ref={subtitleRef}></span>
            <span className="inline-block w-[2px] h-[1em] bg-foreground/70 ml-1 animate-pulse" />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up w-full sm:w-auto" style={{ animationDelay: '0.2s' }}>
            <a
              href="https://wa.me/5511930946704?text=Ol%C3%A1!%20Vim%20atrav%C3%A9s%20do%20seu%20portf%C3%B3lio."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary gap-2 w-full sm:w-auto justify-center"
            >
              <MessageCircle size={20} />
              Entre em contato
            </a>
            <a
              href="#projetos"
              onClick={(e) => {
                e.preventDefault();
                const lenis = (window as any).__lenis;
                if (lenis) {
                  lenis.scrollTo('#projetos', { offset: -80 });
                } else {
                  document.querySelector('#projetos')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-outline gap-2 w-full sm:w-auto justify-center"
            >
              <FolderOpen size={20} />
              Ver projetos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
