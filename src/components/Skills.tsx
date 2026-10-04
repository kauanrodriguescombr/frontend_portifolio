import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import ScrollReveal from './ScrollReveal';

const skills = [
  {
    title: "JavaScript",
    description: "ES6+, DOM, async/await, promises.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
  },
  {
    title: "React.js",
    description: "Hooks, Context API, integração com APIs.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  {
    title: "HTML5",
    description: "Semântica, acessibilidade e SEO.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
  },
  {
    title: "CSS3",
    description: "Flexbox, Grid, animações e responsividade.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
  },
  {
    title: "Node.js",
    description: "APIs REST, autenticação e Express.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
  },
  {
    title: "PostgreSQL",
    description: "Modelagem relacional e otimização.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
  },
  {
    title: "Photoshop",
    description: "Edição e composição visual.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg"
  },
  {
    title: "Illustrator",
    description: "Criação de vetores e identidade visual.",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg"
  }
];

const SkillCard = ({ skill }: { skill: typeof skills[0] }) => {
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
      className="group card-brutalist relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 sm:p-8 h-full min-h-[360px] sm:min-h-[400px] flex flex-col justify-between items-start text-left transition-all duration-300 ease-out hover:scale-[1.03] hover:border-white/40 hover:bg-white/15 backdrop-blur-3xl select-none"
    >
      {/* Faixa de Luz Shimmer */}
      {isShimmering && (
        <span
          key={shimmerKey}
          className="project-card-shimmer"
          onAnimationEnd={handleAnimationEnd}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 flex-1 w-full flex items-center justify-center py-4">
        <img
          src={skill.icon}
          alt={skill.title}
          className="w-[136px] h-[136px] sm:w-[152px] sm:h-[152px] object-contain select-none pointer-events-none drop-shadow-md transition-transform duration-500 ease-out delay-0 group-hover:delay-150 group-hover:scale-110"
        />
      </div>

      <h3 className="relative z-10 font-heading text-4xl sm:text-5xl md:text-6xl text-white tracking-wide mt-auto text-left">
        {skill.title}
      </h3>
    </div>
  );
};

const Skills = () => {
  return (
    <section
      id="habilidades"
      className="py-44 md:py-64 section-accent-bg relative"
      style={{
        clipPath: 'polygon(0 5.5vw, 100% 0, 100% calc(100% - 5.5vw), 0 100%)'
      }}
    >
      <div className="section-container">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="section-title">Habilidades & Tecnologias</h2>
          <p className="section-subtitle max-w-4xl mx-auto">
            Ferramentas e tecnologias que utilizo no dia a dia.
          </p>
        </ScrollReveal>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={12}
          slidesPerView={1.25}
          centeredSlides={skills.length > 2}
          loop={skills.length > 2}
          speed={1200}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: true,
          }}
          breakpoints={{
            480: { slidesPerView: 1.35, spaceBetween: 14 },
            640: { slidesPerView: 2, spaceBetween: 14 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
          }}
          className="skills-swiper carousel-blur py-8 -my-8 px-2"
        >
          {skills.map((skill, index) => (
            <SwiperSlide key={index} className="h-auto">
              <SkillCard skill={skill} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Skills;
