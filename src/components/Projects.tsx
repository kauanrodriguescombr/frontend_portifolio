import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api, { getImageUrl } from '@/services/api';

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
      if (!triggerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const cards = track.children;
      if (cards.length <= 1) return;

      const firstCard = cards[0] as HTMLElement;
      const lastCard = cards[cards.length - 1] as HTMLElement;

      const getScrollAmount = () => {
        return lastCard.offsetLeft - firstCard.offsetLeft;
      };

      const distance = getScrollAmount();

      gsap.to(track, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, projectsList]);

  return (
    <section ref={sectionRef} id="projetos" className="relative overflow-hidden">
      <div
        ref={triggerRef}
        className="h-screen min-h-[500px] w-full flex flex-col justify-center overflow-hidden pt-20 pb-20"
      >
        <div className="text-center mb-8 shrink-0 px-4">
          <h2 className="section-title">Meus Projetos</h2>
          <p className="section-subtitle max-w-4xl mx-auto">
            Seleção dos meus trabalhos mais recentes, demonstrando habilidades em desenvolvimento de sites e design gráfico.
          </p>
        </div>

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
