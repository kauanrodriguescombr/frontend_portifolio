import { useState } from 'react';
import { ExternalLink, Award } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import ScrollReveal from './ScrollReveal';

export interface CertificateItem {
  id?: string;
  title: string;
  description: string;
  organization: string;
  year: string;
  credential: string;
  image?: string | null;
}

const certificates: CertificateItem[] = [
  {
    title: "Desenvolvimento de Software",
    description: "Formação completa em desenvolvimento web com HTML, CSS, JavaScript, React, Node.js e PostgreSQL.",
    organization: "Cubos Academy",
    year: "2022",
    credential: "https://drive.google.com/file/d/1cpSzyD8tls6vyqLVxEYUzFmbC1a8MlXC/view",
  },
  {
    title: "HTML5",
    description: "Curso introdutório de HTML, CSS e JavaScript com projeto prático final.",
    organization: "Curso em Vídeo",
    year: "2022",
    credential: "https://drive.google.com/file/d/1MhPRVoSZV0qHRgsN0Hod0VlUc66ehso_/view",
  },
  {
    title: "Algoritmos",
    description: "Fundamentos de lógica de programação e construção de algoritmos.",
    organization: "Curso em Vídeo",
    year: "2022",
    credential: "https://drive.google.com/file/d/1yrPsuE55DzQ8eWqdt19cuqqmGQzIMgwY/view",
  },
  {
    title: "Workshop IA Lab",
    description: "Workshop intensivo de IA aplicada ao design e identidade visual.",
    organization: "Marcelo Kimura",
    year: "2025",
    credential: "https://drive.google.com/file/d/1cVtlvVukkjDbAevKFoGqM-YEPoa8Dokh/view",
  },
  {
    title: "Workshop TypeLab",
    description: "Workshop intensivo de IA aplicada ao lettering e identidade visual.",
    organization: "Marcelo Kimura e Matheus Mendes",
    year: "2026",
    credential: "https://drive.google.com/file/d/1Xynt5UdfpxHGbikXuK-wVLExjOclnq-6/view?usp=sharing",
  },
];

const CertificationCard = ({ certificate }: { certificate: CertificateItem }) => {
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
    <div
      onMouseEnter={handleMouseEnter}
      className="card-brutalist certification-card relative overflow-hidden p-6 sm:p-8 h-full flex flex-col"
    >
      {/* Faixa de Luz Shimmer: idêntica aos cards de projeto */}
      {isShimmering && (
        <span
          key={shimmerKey}
          className="project-card-shimmer"
          onAnimationEnd={handleAnimationEnd}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            {certificate.image ? (
              <img
                src={certificate.image}
                alt={certificate.title}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <Award size={24} />
            )}
          </div>
          <span className="font-body text-xs font-medium text-foreground/80 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            {certificate.year}
          </span>
        </div>

        <h3 className="font-heading text-6xl text-foreground mb-2 tracking-[.7px]">
          {certificate.title}
        </h3>

        <p className="font-body text-sm text-primary font-medium mb-3">
          {certificate.organization}
        </p>

        <p className="font-body text-sm text-muted-foreground mb-6 flex-grow">
          {certificate.description}
        </p>

        <a
          href={certificate.credential}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-body text-sm font-medium text-foreground hover:text-primary transition-colors mt-auto pt-4 group"
        >
          Ver credencial
          <ExternalLink size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
};

const Certifications = () => {
  return (
    <section id="certificacoes" className="py-20 md:py-32">
      <div className="section-container">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="section-title">Certificações & Cursos</h2>
          <p className="section-subtitle max-w-4xl mx-auto">
            Formação contínua para entregar sempre o melhor resultado.
          </p>
        </ScrollReveal>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={12}
          slidesPerView={1.25}
          centeredSlides={certificates.length > 2}
          loop={certificates.length > 2}
          speed={1200}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: { slidesPerView: 1.35, spaceBetween: 14 },
            640: { slidesPerView: 2, spaceBetween: 14 },
            1024: { slidesPerView: Math.min(3, certificates.length), spaceBetween: 16 },
          }}
          className="certifications-swiper carousel-blur py-8 -my-8 px-2"
        >
          {certificates.map((cert, index) => (
            <SwiperSlide key={cert.id || index} className="h-auto">
              <CertificationCard certificate={cert} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Certifications;
