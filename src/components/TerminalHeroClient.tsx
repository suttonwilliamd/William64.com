import { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";

export default function TerminalHeroClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Modern terminal welcome message
    const welcomeLine = document.createElement("div");
    welcomeLine.className = "terminal-line welcome-line";

    const welcomeText = document.createElement("span");
    welcomeText.className = "terminal-text welcome-text";
    welcomeText.textContent = "william64@portfolio:~$ cat about.txt";

    welcomeLine.appendChild(welcomeText);
    container.appendChild(welcomeLine);

    // Output message with delay
    setTimeout(() => {
      const outputLine = document.createElement("div");
      outputLine.className = "terminal-line output-line";

      const outputText = document.createElement("span");
      outputText.className = "terminal-text output-text";
      outputText.textContent =
        "Senior Software Engineer | Building modern web experiences";

      outputLine.appendChild(outputText);
      container.appendChild(outputLine);

      // Second command
      setTimeout(() => {
        const secondCommandLine = document.createElement("div");
        secondCommandLine.className = "terminal-line";

        const secondPrompt = document.createElement("span");
        secondPrompt.className = "terminal-prompt";
        secondPrompt.textContent = "william64@portfolio:~$";

        const secondCommand = document.createElement("span");
        secondCommand.className = "terminal-text command-text";

        secondCommandLine.appendChild(secondPrompt);
        secondCommandLine.appendChild(secondCommand);
        container.appendChild(secondCommandLine);

        const secondTypewriter = new Typewriter(secondCommand, {
          delay: 40,
          cursor: "▊",
        });

        secondTypewriter
          .typeString("ls projects/")
          .callFunction(() => {
            // Show project listing
            setTimeout(() => {
              const projects = [
                "🚀 William64.com (Portfolio Platform)",
                "🎮 Pebble + Rock (Gaming Platform)",
                "⚡ Performance Optimization Tools",
                "🎨 Design System Components",
              ];

              projects.forEach((project, index) => {
                setTimeout(() => {
                  const projectLine = document.createElement("div");
                  projectLine.className = "terminal-line project-line";

                  const projectText = document.createElement("span");
                  projectText.className = "terminal-text project-text";
                  projectText.textContent = project;

                  projectLine.appendChild(projectText);
                  container.appendChild(projectLine);
                }, index * 300);
              });
            }, 500);
          })
          .start();
      }, 1000);
    }, 500);

    // Subtle animation for text
    const animationInterval = setInterval(() => {
      const welcomeEl = container.querySelector(".welcome-text");
      if (welcomeEl) {
        (welcomeEl as HTMLElement).style.opacity = "0.8";
        setTimeout(() => {
          (welcomeEl as HTMLElement).style.opacity = "1";
        }, 200);
      }
    }, 6000);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="terminal-container">
      <div ref={containerRef} className="terminal-lines">
        {/* Terminal lines will be inserted here */}
      </div>
    </div>
  );
}
