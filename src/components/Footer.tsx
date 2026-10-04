import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
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

  return (
    <footer className="py-6 border-t border-foreground/10 bg-background text-foreground">
      <div className="section-container w-full mx-auto lg:!ml-9 px-6 sm:px-10 lg:!p-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                aria-label={link.label}
              >
                <link.icon size={20} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-body text-sm sm:text-base text-muted-foreground text-center sm:text-right">
            Desenvolvido por: <span className="text-foreground font-medium">Kauan Rodrigues</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
