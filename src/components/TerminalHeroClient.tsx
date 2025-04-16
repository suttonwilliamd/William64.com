import { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";

export default function TerminalHeroClient() {
  const el = useRef<HTMLSpanElement>(null);
  const prompt = "user@william64:~$ ";

  useEffect(() => {
    if (!el.current) return;

    const typewriter = new Typewriter(el.current, {
      loop: true,
      delay: 50,
      deleteSpeed: 30,
    });

    typewriter
      .typeString(prompt)
      .pauseFor(300)
      .typeString("Welcome to William64.com")
      .pauseFor(1500)
      // Delete the command text but leave the prompt intact
      .deleteChars("Welcome to William64.com".length)
      .pauseFor(500)
      .typeString("Let's build something cool.")
      .pauseFor(1500)
      .deleteAll()
      .start();

    // Glitch effect triggered every 5 seconds
    const glitchInterval = setInterval(() => {
      el.current?.classList.add("glitch");
      setTimeout(() => el.current?.classList.remove("glitch"), 300);
    }, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(glitchInterval);
  }, []);

  return <span ref={el} className="terminal-text" />;
}
