import { Mail, MessageCircle, Github, Linkedin, FolderOpen } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const socialLinks = [
  {
    href: "https://github.com/kauandevfr",
    icon: Github,
    label: "GitHub"
  },
  {
    href: "https://www.linkedin.com/in/kauan-rodrigues-b4b311195/",
    icon: Linkedin,
    label: "LinkedIn"
  },
  {
    href: "mailto:kauan@kauanrodrigues.com.br",
    icon: Mail,
    label: "Email"
  }
];

const Contact = () => {
  return (
    <section id="contato" className="py-16 md:py-24 min-h-screen flex items-center justify-center lg:justify-start bg-background text-foreground overflow-hidden">
      <div className="section-container w-full mx-auto lg:!ml-9 px-6 sm:px-10 lg:!p-0 relative z-10 flex flex-col items-center lg:items-start">
        <div className="flex flex-col justify-between min-h-[75vh] lg:min-h-[80vh] gap-12 lg:gap-16 w-full text-center lg:text-left items-center lg:items-start">

          {/* Canto Superior: Título e Subtítulo com tamanho de fonte e alinhamento idênticos ao Hero */}
          <ScrollReveal className="text-center lg:text-left w-full flex flex-col items-center lg:items-start">
            <h2
              className="!leading-[80%] uppercase font-heading text-center lg:text-left mb-4 w-full"
              style={{ fontSize: 'clamp(2.5rem, min(18vw, 28vh), 22rem)' }}
            >
              <span className="block text-white">VAMOS TRABALHAR</span>
              <span className="block text-primary">JUNTOS?</span>
            </h2>

            <p className="font-body text-xl sm:text-2xl md:text-3xl text-muted-foreground leading-relaxed text-center lg:text-left max-w-3xl">
              Se você tem uma boa ideia, vamos tirá-la do papel.
            </p>
          </ScrollReveal>

          {/* Seção Inferior de Ações e Redes */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 w-full pt-4">
            {/* Ícones das redes e Desenvolvido por */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-center sm:text-left">
              <div className="flex items-center justify-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-white hover:text-primary transition-all duration-200"
                    aria-label={link.label}
                  >
                    <link.icon size={32} className="text-white hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>

              <p className="font-body text-base sm:text-lg md:text-xl text-gray-300">
                Desenvolvido por: <span className="text-white font-medium">Kauan Rodrigues</span>
              </p>
            </div>

            {/* Botões principais com a mesma disposição e estilo do Hero */}
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
      </div>
    </section>
  );
};

export default Contact;
