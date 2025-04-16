import { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";

export default function TerminalHeroClient() {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const typewriter = new Typewriter(el.current, {
      loop: true,
      delay: 50,
      // Optionally, configure the cursor character here if the lib supports it.
    });

    typewriter
      .typeString("Welcome to William64.com")
      .pauseFor(1500)
      .deleteAll()
      .typeString("Let's build something cool.")
      .pauseFor(1500)
      .start();

    // Optionally, inject a glitch effect by toggling a CSS class
    // For example:
    // setInterval(() => {
    //   el.current?.classList.add("glitch");
    //   setTimeout(() => el.current?.classList.remove("glitch"), 100);
    // }, 5000);
  }, []);

  return <span ref={el} className="terminal-text" />;
}
