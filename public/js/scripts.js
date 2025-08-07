import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Animación inicial del logo y fondo
const tl = gsap.timeline({
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#section1", // Asegura que se active al scrollear desde la primera sección
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

tl.to("#hero-key", { duration: 1, scale: 1 })
  .to("#hero-key-logo", { opacity: 0 }, "<")
  .to("#logo_header", { opacity: 1 }, "< 0.5")
  .to(
    "#logo-mask",
    {
      opacity: 1,
      maskSize: "clamp(20vh, 25%, 30vh)",
    },
    0.15
  )
  .to(
    "#hero-key",
    {
      opacity: 0,
      duration: 0.2,
    },
    0.4
  );

// Fade in de la sección 2
gsap.to("#section2", {
  opacity: 1,
  scrollTrigger: {
    trigger: "#section2",
    start: "top center",
    scrub: true,
  },
});

// Entrada de la sección 3
gsap.from("#section3 h2", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: "#section3",
    start: "top center",
    toggleActions: "play none none none",
  },
});
