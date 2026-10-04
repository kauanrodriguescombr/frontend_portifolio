import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api, { getImageUrl } from '@/services/api';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  techs: string[];
  image: string;
  repo?: string | null;
  access: string;
}

const ProjectCardSkeleton = () => (
  <div className="card-brutalist relative overflow-hidden h-[42vh] min-h-[260px] max-h-[480px] flex flex-col justify-end w-[85vw] max-w-[800px] shrink-0 bg-white/5 border border-white/10 p-6 sm:p-8 animate-pulse">
    <div className="relative z-10 flex flex-col justify-end space-y-4 max-w-2xl">
      <div className="h-10 sm:h-14 w-2/3 bg-white/10 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-white/10 rounded" />
        <div className="h-4 w-4/5 bg-white/10 rounded" />
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        <div className="h-6 w-20 bg-white/10 rounded-full" />
        <div className="h-6 w-24 bg-white/10 rounded-full" />
        <div className="h-6 w-16 bg-white/10 rounded-full" />
        <div className="h-6 w-28 bg-white/10 rounded-full" />
      </div>
    </div>
  </div>
);

const ProjectCard = ({ project }: { project: ProjectItem }) => {
  const [shimmerKey, setShimmerKey] = useState(0);
  const [isShimmering, setIsShimmering] = useState(false);

  const handleMouseEnter = () => {
    setIsShimmering(true);
    setShimmerKey((prev) => prev + 1);
  };

  const handleAnimationEnd = () => {
    setIsShimmering(false);
  };

  return (
    <a
      href={project.access}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      className="card-brutalist project-card relative overflow-hidden h-[42vh] min-h-[260px] max-h-[480px] flex flex-col justify-end w-[85vw] max-w-[800px] shrink-0"
    >
      {/* Imagem de Fundo Completa */}
      <img
        src={getImageUrl(project.image)}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradiente de Escurecimento por Cima da Imagem */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Faixa de Luz Shimmer: montada apenas durante o ciclo, evitando qualquer vazamento em repouso e reiniciando na hora */}
      {isShimmering && (
        <span
          key={shimmerKey}
          className="project-card-shimmer"
          onAnimationEnd={handleAnimationEnd}
          aria-hidden="true"
        />
      )}

      {/* Conteúdo de Texto Sobrelapado */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end">
        <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl text-white mb-2 tracking-wide">
          {project.title}
        </h3>

        <p className="font-body text-xs sm:text-sm md:text-base text-gray-200 mb-4 sm:mb-6 max-w-2xl leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.techs.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-body font-medium bg-white/20 text-white backdrop-blur-md rounded-full border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};

// Configurações de sobreposição entre o movimento horizontal e o pin da seção
// Em telas responsivas (tablets e celulares < 1024px), o offset é zero para sincronização direta e travamento imediato.
// Em desktop (≥ 1024px), mantém a sobreposição de 650px.
const getOffsets = () => {
  const isResponsive = typeof window !== 'undefined' && window.innerWidth < 1024;
  return {
    horizontalStart: isResponsive ? 0 : 650,
    pinEnd: isResponsive ? 0 : 650,
  };
};

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca projetos diretamente da API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api
      .get<{ status: string; projects: ProjectItem[] }>('/projects')
      .then((data) => {
        if (isMounted) {
          setProjectsList(data?.projects || []);
        }
      })
      .catch((error) => {
        console.error('Falha ao carregar projetos da API:', error);
        if (isMounted) {
          setProjectsList([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (isLoading || projectsList.length === 0) return;

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !triggerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const cards = track.children;
      if (cards.length <= 1) return;

      const firstCard = cards[0] as HTMLElement;
      const lastCard = cards[cards.length - 1] as HTMLElement;

      const getScrollAmount = () => {
        return Math.max(0, lastCard.offsetLeft - firstCard.offsetLeft);
      };

      const getPinDuration = () => {
        const { horizontalStart, pinEnd } = getOffsets();
        return Math.max(0, getScrollAmount() - horizontalStart - pinEnd);
      };

      // 1. ScrollTrigger dedicado ao pin da seção
      const pinTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: triggerRef.current,
        start: 'top top',
        end: () => `+=${getPinDuration()}`,
        invalidateOnRefresh: true,
      });

      // 2. Animação horizontal dos cards sincronizada com os offsets de entrada e saída:
      // - No desktop: começa 650px antes e termina 650px depois
      // - No responsivo (< 1024px): offsets zerados, sincronia direta
      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          start: () => pinTrigger.start - getOffsets().horizontalStart,
          end: () => pinTrigger.end + getOffsets().pinEnd,
          scrub: 1.4,
          invalidateOnRefresh: true,
        },
      });

      // Recalcula ScrollTrigger se imagens terminarem de carregar
      const images = track.querySelectorAll('img');
      images.forEach((img) => {
        if (!img.complete) {
          img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
        }
      });

      // Se a animação de introdução estiver ativa no primeiro carregamento,
      // atualiza o ScrollTrigger após a intro finalizar
      if ((window as any).__introActive) {
        const handleIntro = () => {
          ScrollTrigger.refresh();
        };
        window.addEventListener('intro:complete', handleIntro, { once: true });
        return () => {
          window.removeEventListener('intro:complete', handleIntro);
        };
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, projectsList]);

  return (
    <section ref={sectionRef} id="projetos" className="relative overflow-hidden w-full max-w-full">
      <div
        ref={triggerRef}
        className="h-screen min-h-[500px] w-full flex flex-col justify-center overflow-hidden pt-20 pb-20"
      >
        <ScrollReveal className="text-center mb-8 shrink-0 px-4">
          <h2 className="section-title">Meus Projetos</h2>
          <p className="section-subtitle max-w-4xl mx-auto">
            Seleção dos meus trabalhos mais recentes, demonstrando habilidades em desenvolvimento de sites e design gráfico.
          </p>
        </ScrollReveal>

        {/* Esteira horizontal dos cards */}
        <div
          ref={trackRef}
          className="flex gap-12 sm:gap-32 md:gap-44 items-stretch will-change-transform"
          style={{
            paddingLeft: 'calc(50vw - min(42.5vw, 400px))',
            paddingRight: 'calc(50vw - min(42.5vw, 400px))',
          }}
        >
          {isLoading ? (
            <>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </>
          ) : projectsList.length === 0 ? (
            <div className="w-full text-center py-20">
              <p className="font-body text-base text-muted-foreground">
                Nenhum projeto disponível no momento.
              </p>
            </div>
          ) : (
            projectsList.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
