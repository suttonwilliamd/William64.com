import { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";

export default function TerminalHeroClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create first terminal line with prompt
    const line1 = document.createElement('div');
    line1.className = "terminal-line";
    
    const prompt1 = document.createElement('span');
    prompt1.className = "terminal-prompt";
    prompt1.textContent = "user@william64:~$ ";
    
    const text1 = document.createElement('span');
    text1.className = "terminal-text";
    
    line1.appendChild(prompt1);
    line1.appendChild(text1);
    containerRef.current.appendChild(line1);
    
    // Create second terminal line with prompt
    const line2 = document.createElement('div');
    line2.className = "terminal-line";
    line2.style.display = "none"; // Hide initially
    
    const prompt2 = document.createElement('span');
    prompt2.className = "terminal-prompt";
    prompt2.textContent = "user@william64:~$ ";
    
    const text2 = document.createElement('span');
    text2.className = "terminal-text";
    
    line2.appendChild(prompt2);
    line2.appendChild(text2);
    containerRef.current.appendChild(line2);
    
    // Set up first typewriter
    const typewriter1 = new Typewriter(text1, {
      delay: 50,
      cursor: "▋"
    });
    
    // Set up second typewriter
    const typewriter2 = new Typewriter(text2, {
      delay: 50,
      cursor: "▋"
    });
    
    // Type first message, then show second line and type second message
    typewriter1
      .typeString("Welcome to William64.com")
      .callFunction(() => {
        setTimeout(() => {
          line2.style.display = "block"; // Show second line
          typewriter2
            .typeString("Let's build something cool.")
            .start();
        }, 500);
      })
      .start();
    
    // Occasional glitch effect
    const glitchInterval = setInterval(() => {
      const randomElement = Math.random() > 0.5 ? text1 : text2;
      randomElement.classList.add("glitch");
      setTimeout(() => randomElement.classList.remove("glitch"), 300);
    }, 8000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  return (
    <div className="terminal-emulator">
      <div ref={containerRef} className="terminal-container">
        {/* Terminal lines will be inserted here */}
      </div>
    </div>
  );
}
