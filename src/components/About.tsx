import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const paragraphs = [
  "Sou desenvolvedor Front-end e estudante de Análise e Desenvolvimento de Sistemas pela Anhanguera, com formação complementar em Desenvolvimento de Software pela Cubos Academy. Tenho experiência prática no desenvolvimento de interfaces modernas, com foco em qualidade, organização e boa experiência de uso.",
  "Também possuo experiência com desenvolvimento, deploy e gerenciamento de aplicações, além do uso de Inteligência Artificial como ferramenta de apoio ao processo de desenvolvimento.",
  "Atualmente, aprofundo meus conhecimentos em arquitetura Front-end, performance e boas práticas de desenvolvimento, buscando construir aplicações cada vez mais escaláveis, modulares e fáceis de manter.",
];

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (!triggerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const blocks = track.children;
      if (blocks.length === 0) return;

      const firstBlock = blocks[0] as HTMLElement;
      const lastBlock = blocks[blocks.length - 1] as HTMLElement;

      const getScrollDistance = () => {
        return lastBlock.offsetTop - firstBlock.offsetTop;
      };

      gsap.to(track, {
        y: () => -(lastBlock.offsetTop - firstBlock.offsetTop),
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${lastBlock.offsetTop - firstBlock.offsetTop}`,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="sobre" className="relative overflow-hidden bg-background">
      <div
        ref={triggerRef}
        className="min-h-screen w-full flex items-center justify-center py-20 lg:py-0 px-6 sm:px-10 lg:px-16"
      >
        <div className="w-full max-w-[90rem] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 sm:gap-16 lg:gap-36 xl:gap-44 lg:max-h-screen">

          {/* Título "Sobre Mim" - Centralizado em tablets e celulares, à esquerda em desktop */}
          <div className="w-full lg:w-auto shrink-0 z-10 flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-0">
            <ScrollReveal>
              <h2
                className="!leading-[80%] uppercase font-heading text-foreground mb-0 text-center lg:text-left whitespace-nowrap sm:whitespace-normal"
                style={{ fontSize: 'clamp(2.5rem, min(18vw, 28vh), 22rem)' }}
              >
                <span className="inline sm:block">Sobre</span>{' '}
                <span className="inline sm:block text-primary">mim</span>
              </h2>
            </ScrollReveal>
          </div>

          {/* Palco dos textos - Em fluxo normal e visível em tablets/mobile, pin e scroll vertical em desktop */}
          <div className="w-full lg:w-auto flex-1 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto lg:ml-auto relative h-auto lg:h-screen overflow-visible lg:overflow-hidden">
            <div
              ref={trackRef}
              className="flex flex-col gap-8 sm:gap-10 lg:gap-0 will-change-auto lg:will-change-transform w-full"
            >
              {paragraphs.map((text, index) => (
                <div key={index} className="w-full h-auto lg:h-screen flex items-center justify-center lg:justify-start shrink-0">
                  <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 font-normal leading-relaxed w-full text-center lg:text-left">
                    {text.includes("resolução de problemas") ? (
                      <>
                        Destaco-me pela <strong className="text-primary font-semibold">resolução de problemas</strong>, <strong className="text-primary font-semibold">comunicação clara</strong>, <strong className="text-primary font-semibold">aprendizagem rápida</strong> e <strong className="text-primary font-semibold">trabalho em equipe</strong>.
                      </>
                    ) : (
                      text
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
