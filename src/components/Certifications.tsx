import { useState, useEffect } from 'react';
import { ExternalLink, Award } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import api, { getImageUrl } from '@/services/api';

export interface CertificateItem {
  id?: string;
  title: string;
  description: string;
  organization: string;
  year: string;
  credential: string;
  image?: string | null;
}

const CertificationCardSkeleton = () => (
  <div className="card-brutalist certification-card relative overflow-hidden p-6 sm:p-8 h-full min-h-[320px] flex flex-col justify-between animate-pulse bg-white/5 border border-white/10">
    <div>
      {/* Top row: Icon and Year */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="w-16 h-6 rounded-full bg-white/10" />
      </div>
      {/* Title */}
      <div className="h-10 w-4/5 bg-white/10 rounded-lg mb-4" />
      {/* Organization */}
      <div className="h-4 w-2/5 bg-white/10 rounded mb-4" />
      {/* Description */}
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-white/10 rounded" />
        <div className="h-4 w-3/4 bg-white/10 rounded" />
      </div>
    </div>
    {/* Credential link */}
    <div className="h-4 w-32 bg-white/10 rounded pt-2" />
  </div>
);

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
                src={getImageUrl(certificate.image)}
                alt={certificate.title}
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
  const [certificatesList, setCertificatesList] = useState<CertificateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api
      .get<{ status: string; certificates: CertificateItem[] }>('/certificates')
      .then((data) => {
        if (isMounted) {
          setCertificatesList(data?.certificates || []);
        }
      })
      .catch((error) => {
        console.error('Falha ao carregar certificados da API:', error);
        if (isMounted) {
          setCertificatesList([]);
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

  return (
    <section id="certificacoes" className="py-20 md:py-32">
      <div className="section-container">
        <div className="mb-12 text-center">
          <h2 className="section-title">Certificações & Cursos</h2>
          <p className="section-subtitle max-w-4xl mx-auto">
            Formação contínua para entregar sempre o melhor resultado.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CertificationCardSkeleton />
            <CertificationCardSkeleton />
            <CertificationCardSkeleton />
          </div>
        ) : certificatesList.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-base text-muted-foreground">
              Nenhuma certificação disponível no momento.
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={1}
            centeredSlides={certificatesList.length > 2}
            loop={certificatesList.length > 2}
            speed={1200}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 14 },
              1024: { slidesPerView: Math.min(3, certificatesList.length), spaceBetween: 16 },
            }}
            className="certifications-swiper carousel-blur"
          >
            {certificatesList.map((cert, index) => (
              <SwiperSlide key={cert.id || index} className="h-auto">
                <CertificationCard certificate={cert} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Certifications;
