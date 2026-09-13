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
    const ctx = gsap.context(() => {
      if (!triggerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const blocks = track.children;
      if (blocks.length === 0) return;

      const firstBlock = blocks[0] as HTMLElement;
      const lastBlock = blocks[blocks.length - 1] as HTMLElement;

      const getScrollDistance = () => {
        return lastBlock.offsetTop - firstBlock.offsetTop;
      };

      const distance = getScrollDistance();

      gsap.to(track, {
        y: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="sobre" className="relative overflow-hidden bg-background">
      <div
        ref={triggerRef}
        className="min-h-screen w-full flex items-center justify-center py-20 md:py-0 px-4 sm:px-8 md:px-12"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center max-h-screen">

          {/* Lado Esquerdo Fixo: Título "SOBRE MIM?" */}
          <div className="md:col-span-6 lg:col-span-6 flex items-center z-10 pt-8 md:pt-0">
            <ScrollReveal>
              <h2
                className="!leading-[80%] uppercase font-heading tracking-tight whitespace-nowrap"
                style={{ fontSize: 'clamp(3rem, 12vw, 22rem)' }}
              >
                <span className="text-white"
                  style={{ fontSize: 'clamp(2.5rem, min(18vw, 28vh), 22rem)' }}
                >SOBRE MIM</span>
              </h2>
            </ScrollReveal>
          </div>

          {/* Lado Direito: Palco dos textos (cada bloco tem a altura da área útil h-[65vh] md:h-screen) */}
          <div className="md:col-span-6 lg:col-span-6 relative h-[60vh] md:h-screen overflow-hidden">
            <div
              ref={trackRef}
              className="flex flex-col will-change-transform w-full max-w-xl pr-4"
            >
              {paragraphs.map((text, index) => (
                <div key={index} className="w-full h-[60vh] md:h-screen flex items-center shrink-0">
                  <p className="font-body text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white font-normal leading-relaxed">
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
