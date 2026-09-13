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
    <section id="contato" className="py-16 md:py-24 min-h-screen flex items-center bg-background text-foreground overflow-hidden">
      <div className="w-full px-4 sm:px-8 md:px-12">
        <div className="flex flex-col justify-between h-full gap-8 md:gap-12">

          {/* Canto Superior Esquerdo */}
          <ScrollReveal className="text-left">
            <h2
              className="!leading-[80%] uppercase font-heading text-left mb-3"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 22rem)' }}
            >
              <span className="block text-white">VAMOS TRABALHAR</span>
              <span className="block text-primary">JUNTOS?</span>
            </h2>

            <p className="font-body text-xl sm:text-2xl md:text-3xl text-muted-foreground leading-relaxed">
              Se você tem uma boa ideia, vamos tirá-la do papel.
            </p>
          </ScrollReveal>

          {/* Seção de Ações e Redes (Horizontal) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full pt-4">
            {/* Ícones das redes e Desenvolvido por */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 flex items-center justify-center text-white hover:text-primary transition-all duration-200"
                    aria-label={link.label}
                  >
                    <link.icon size={36} className="text-white" />
                  </a>
                ))}
              </div>

              <p className="font-body text-lg sm:text-xl text-gray-300">
                Desenvolvido por: <span className="text-white font-medium">Kauan Rodrigues</span>
              </p>
            </div>

            {/* Botões principais */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                className="btn-outline gap-2 w-full sm:w-auto"
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
