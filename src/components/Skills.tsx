import Carousel from './Carousel';
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

const SkillCard = ({ skill }: { skill: typeof skills[0] }) => (
  <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center transition-all duration-300 hover:border-white/40 hover:bg-white/15 backdrop-blur-3xl">
    <div className="w-20 h-20 mb-6 flex items-center justify-center bg-white/10 rounded-xl">
      <img
        src={skill.icon}
        alt={skill.title}
        className="w-14 h-14 object-contain"
      />
    </div>

    <h3 className="font-heading text-6xl text-white mb-3 tracking-[.7px]">
      {skill.title}
    </h3>

    <p className="font-body text-base text-white/80">
      {skill.description}
    </p>
  </div>
);

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

        <Carousel>
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Skills;
