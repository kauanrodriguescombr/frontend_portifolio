import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

const projects: ProjectItem[] = [
  {
    title: "Fluxo Financeiro",
    description: "Sistema de controle financeiro pessoal com dashboard e gráficos.",
    techs: ["ReactJS", "HTML5", "CSS3", "Node.js", "PostgreSQL"],
    image: "/fluxo-financeiro.avif",
    repo: "https://github.com/kauandevfr/fluxofinanceirofrontend",
    access: "https://fluxofinanceiro.kauanrodrigues.com.br",
  },
  {
    title: "Sistema Salve Quebrada",
    description: "Plataforma de gestão pedagógica e operacional para controle de alunos, turmas, presenças e eventos.",
    techs: ["ReactJS", "SCSS", "Node.js", "Express", "PostgreSQL"],
    image: "/sistema-salve-quebrada.avif",
    repo: "https://github.com/kauandevfr/frontend_dashboard_salvequebrada",
    access: "https://sistema.salvequebrada.org/",
  },
  {
    title: "Salve Quebrada",
    description: "Iniciativa social voltada à promoção do esporte e do desenvolvimento social na comunidade.",
    techs: ["ReactJS", "HTML5", "CSS3"],
    image: "/salve-quebrada.avif",
    repo: "https://github.com/kauandevfr/salve-quebrada",
    access: "https://www.salvequebrada.org/",
  },
  {
    title: "Portifólio",
    description: "Projeto autoral desenvolvido com apoio de inteligência artificial, com implementação e customização realizadas manualmente.",
    techs: ["ReactJS", "HTML5", "Inteligência Artificial"],
    image: "/portifolio.avif",
    repo: "https://github.com/kauandevfr/portifolio-v2",
    access: "https://kauanrodrigues.com.br/",
  },
  // {
  //   title: "Tarefas",
  //   description: "Sistema de controle de tarefas.",
  //   techs: ["ReactJS", "HTML5", "CSS3", "Node.js", "PostgreSQL"],
  //   image: "/tarefas.avif",
  //   repo: "https://github.com/kauandevfr/taskmanagement-frontend",
  //   access: "https://tarefas.kauanrodrigues.com.br/",
  // },
  {
    title: "Métricas",
    description: "Sistema que apresenta algumas informações de homelab caseiro.",
    techs: ["HTML5", "CSS3", "JavaScript", "Inteligência Artificial"],
    image: "/metricasservidor.avif",
    access: "https://metricas.kauanrodrigues.com.br/",
  },
];

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
        src={project.image}
        alt={project.title}
        onError={(e) => {
          e.currentTarget.src = '/placeholder.svg';
        }}
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

  useLayoutEffect(() => {
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
  }, []);

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
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
