import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./IntroAnimation.css";

const STORAGE_KEY = "portfolio_intro_seen";

interface IntroAnimationProps {
  onComplete: () => void;
}

/**
 * IntroAnimation
 *
 * Exibe uma sequência de textos cinematográfica antes de revelar o site.
 * Controla a execução via sessionStorage: roda uma vez por sessão de aba.
 * Usa GSAP (já disponível no projeto) para timing preciso e suave.
 *
 * Props:
 *   onComplete — chamado quando a intro termina (o parent remove o overlay)
 */
/**
 * Replica o padrão de markup do Hero.tsx:
 * cada caractere fica em um <span inline-block> para que a fonte
 * KrishaRegular renderize com o mesmo recorte visual do h1 principal.
 */
const CharText = ({ text }: { text: string }) => (
  <span className="inline-block whitespace-nowrap">
    {text.split("").map((char, i) => (
      <span key={i} className="inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </span>
);

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const olaRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isCompletedRef = useRef(false);

  const handleSkip = () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;

    if (tlRef.current) {
      tlRef.current.kill();
    }

    if (overlayRef.current) {
      overlayRef.current.classList.remove("intro-inverted");
      overlayRef.current.style.backgroundColor = "#000";

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          document.body.style.overflow = "";
          window.dispatchEvent(new CustomEvent("intro:complete"));
          onComplete();
        },
      });
    } else {
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("intro:complete"));
      onComplete();
    }
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const ola = olaRef.current;
    const sub = subRef.current;
    const name = nameRef.current;
    const bridge = bridgeRef.current;
    const portfolio = portfolioRef.current;

    if (!overlay || !ola || !sub || !name || !bridge || !portfolio) return;

    // KAUAN não tem slide: zera o transform CSS inicial
    gsap.set(name, { y: 0 });
    const kauanTextEl = name.querySelector('.intro-kauan-text') as HTMLElement | null;

    // Scroll já foi travado pelo App.tsx antes do primeiro render.
    // O cleanup garante que o overflow seja restaurado caso o componente desmonte antes do onComplete.

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        if (isCompletedRef.current) return;
        isCompletedRef.current = true;
        // Restaura scroll, dispara evento para o Hero iniciar suas animações e chama o callback
        document.body.style.overflow = "";
        window.dispatchEvent(new CustomEvent("intro:complete"));
        onComplete();
      },
    });
    tlRef.current = tl;

    /**
     * SEQUÊNCIA:
     *  0.0s  — OLA aparece
     *  0.8s  — OLA some
     *  1.0s  — "Me chamo" aparece
     *  1.7s  — "Me chamo" some
     *  1.9s  — KAUAN aparece (sobe rápido, fica mais tempo)
     *  3.1s  — KAUAN some
     *  3.3s  — "e esse é o meu" aparece
     *  3.9s  — "e esse é o meu" some
     *  4.0s  — PORTIFOLIO + linha aparecem
     *  5.4s  — tudo some + overlay faz fade out
     */

    const ENTER_DUR = 0.45;
    const FADE_Y = -50;  // textos entram de cima (negativo = acima)
    const EXIT_DUR = 0.3;
    const EXIT_Y = 30;   // saída para baixo

    // ─── OLA ───────────────────────────────────────────────────────────────
    tl.fromTo(ola,
      { opacity: 0, y: FADE_Y },
      { opacity: 1, y: 0, duration: ENTER_DUR },
      0
    )
      .to(ola,
        { opacity: 0, y: EXIT_Y, duration: EXIT_DUR },
        0.9
      )

      // ─── Me chamo ──────────────────────────────────────────────────────────
      .fromTo(sub,
        { opacity: 0, y: FADE_Y },
        { opacity: 1, y: 0, duration: ENTER_DUR },
        1.1
      )
      // Saída sem efeito
      .set(sub, { opacity: 0 }, 1.85)

      // ─── KAUAN — typewriter com cursor _, sem efeito de entrada/saída ────────
      .call(() => {
        // Inversão de cores instantânea + reset do texto
        gsap.set(overlay, { backgroundColor: "#fff" });
        overlay.classList.add("intro-inverted");
        if (kauanTextEl) kauanTextEl.textContent = '';
      }, undefined, 2.0)
      // Aparece instantaneamente (sem y, sem scale)
      .set(name, { opacity: 1 }, 2.0)
      // Saída instantânea após ficar tempo suficiente na tela com todas as letras decodificadas
      .set(name, { opacity: 0 }, 5.0)
      // Reverte fundo quando Kauan some
      .call(() => {
        gsap.set(overlay, { backgroundColor: "#000" });
        overlay.classList.remove("intro-inverted");
      }, undefined, 5.0)

      // ─── e esse é o meu ────────────────────────────────────────────────────
      .fromTo(bridge,
        { opacity: 0, y: FADE_Y },
        { opacity: 1, y: 0, duration: ENTER_DUR },
        5.25
      )
      .to(bridge,
        { opacity: 0, y: EXIT_Y, duration: EXIT_DUR },
        5.85
      )

      // ─── PORTIFOLIO ────────────────────────────────────────────────────────
      .fromTo(portfolio,
        { opacity: 0, y: 50, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power4.out" },
        5.95
      )

      // ─── Saída final (PORTIFOLIO + overlay) ────────────────────────────────
      .to([portfolio],
        { opacity: 0, y: EXIT_Y, duration: 0.4, ease: "power2.in" },
        7.4
      )
      .to(overlay,
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        7.6
      );

    // ─── Typewriter + Scramble em cascata: próxima letra inicia antes da anterior travar ───
    const word = "KAUAN";
    const scrambleChars = word;
    const getRandomChar = () => scrambleChars[Math.floor(Math.random() * scrambleChars.length)];

    const baseTime = 2.05;
    const staggerDelay = 0.20; // Cada letra começa a scramblar 200ms após a anterior
    const scrambleDuration = 0.7; // Cada letra fica scramblando por 550ms até travar
    const frameInterval = 0.04; // Troca rápida de caractere a cada 40ms

    const totalDuration = (word.length - 1) * staggerDelay + scrambleDuration;
    const totalFrames = Math.ceil(totalDuration / frameInterval);

    for (let frame = 0; frame <= totalFrames; frame++) {
      const currentTime = baseTime + frame * frameInterval;
      const elapsed = frame * frameInterval;

      tl.call(() => {
        if (!kauanTextEl) return;

        let output = "";
        for (let i = 0; i < word.length; i++) {
          const letterStartTime = i * staggerDelay;
          const letterLockTime = letterStartTime + scrambleDuration;

          if (elapsed < letterStartTime) {
            // Letra ainda não começou a aparecer
            break;
          } else if (elapsed >= letterLockTime) {
            // Letra decodificada e travada na correta
            output += word[i];
          } else {
            // Letra em scramble ativo
            output += getRandomChar();
          }
        }
        kauanTextEl.textContent = output;
      }, undefined, currentTime);
    }

    return () => {
      // Limpa na desmontagem (HMR, etc.)
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div ref={overlayRef} className="intro-overlay">
      <div className="intro-text-wrapper" aria-hidden="true">
        <div ref={olaRef} className="intro-text intro-text--ola"><CharText text="Olá," /></div>
        <div ref={subRef} className="intro-text intro-text--sub">Me chamo</div>
        <div ref={nameRef} className="intro-text intro-text--name">
          <span className="intro-kauan-text"></span><span className="intro-kauan-cursor">_</span>
        </div>
        <div ref={bridgeRef} className="intro-text intro-text--bridge">e esse é o meu</div>
        <div ref={portfolioRef} className="intro-text intro-text--portfolio"><CharText text="Portifólio" /></div>
      </div>

      <button
        type="button"
        className="intro-skip-btn"
        onClick={handleSkip}
        aria-label="Pular animação de introdução"
      >
        <span className="intro-skip-btn__text">Pular Animação</span>
        <svg
          className="intro-skip-btn__icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export { STORAGE_KEY };
export default IntroAnimation;
