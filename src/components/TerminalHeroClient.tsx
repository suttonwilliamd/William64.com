import { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";

export default function TerminalHeroClient() {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const typewriter = new Typewriter(el.current, {
      loop: true,
      delay: 50,
    });

    typewriter
      .typeString("Welcome to William64.com")
      .pauseFor(1500)
      .deleteAll()
      .typeString("Let's build something cool.")
      .pauseFor(1500)
      .start();

     setInterval(() => {
       el.current?.classList.add("glitch");
       setTimeout(() => el.current?.classList.remove("glitch"), 300);
     }, 5000);
  }, []);

  return <span ref={el} className="terminal-text" />;
}
