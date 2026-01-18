import { useEffect, useRef } from "react";
import Typewriter from "typewriter-effect/dist/core";

export default function TerminalHeroClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Modern terminal welcome message
    const welcomeLine = document.createElement('div');
    welcomeLine.className = "terminal-line welcome-line";
    
    const welcomeText = document.createElement('span');
    welcomeText.className = "terminal-text welcome-text";
    welcomeText.textContent = "William64.com";
    
    welcomeLine.appendChild(welcomeText);
    containerRef.current.appendChild(welcomeLine);
    
    // Subtitle line
    const subtitleLine = document.createElement('div');
    subtitleLine.className = "terminal-line subtitle-line";
    
    const subtitleText = document.createElement('span');
    subtitleText.className = "terminal-text subtitle-text";
    subtitleText.textContent = "Software Engineer | Retro Tech Enthusiast";
    
    subtitleLine.appendChild(subtitleText);
    containerRef.current.appendChild(subtitleLine);
    
    // Modern prompt line
    const promptLine = document.createElement('div');
    promptLine.className = "terminal-line prompt-line";
    
    const prompt = document.createElement('span');
    prompt.className = "terminal-prompt";
    prompt.textContent = "william64@cyberspace:~$";
    
    const command = document.createElement('span');
    command.className = "terminal-text command-text";
    
    promptLine.appendChild(prompt);
    promptLine.appendChild(command);
    containerRef.current.appendChild(promptLine);
    
    // Set up typewriter for command
    const typewriter = new Typewriter(command, {
      delay: 30,
      cursor: "▋"
    });
    
    // Modern command sequence
    typewriter
      .typeString("cat welcome.txt")
      .callFunction(() => {
        setTimeout(() => {
          // Show welcome message output
          const outputLine = document.createElement('div');
          outputLine.className = "terminal-line output-line";
          
          const outputText = document.createElement('span');
          outputText.className = "terminal-text output-text";
          outputText.textContent = "Welcome to my digital workspace!";
          
          outputLine.appendChild(outputText);
          containerRef.current.appendChild(outputLine);
          
          // Add another command after delay
          setTimeout(() => {
            const secondPromptLine = document.createElement('div');
            secondPromptLine.className = "terminal-line prompt-line";
            
            const secondPrompt = document.createElement('span');
            secondPrompt.className = "terminal-prompt";
            secondPrompt.textContent = "william64@cyberspace:~$";
            
            const secondCommand = document.createElement('span');
            secondCommand.className = "terminal-text command-text";
            
            secondPromptLine.appendChild(secondPrompt);
            secondPromptLine.appendChild(secondCommand);
            containerRef.current.appendChild(secondPromptLine);
            
            const secondTypewriter = new Typewriter(secondCommand, {
              delay: 30,
              cursor: "▋"
            });
            
            secondTypewriter
              .typeString("explore projects")
              .callFunction(() => {
                // Add final message
                setTimeout(() => {
                  const finalLine = document.createElement('div');
                  finalLine.className = "terminal-line final-line";
                  
                  const finalText = document.createElement('span');
                  finalText.className = "terminal-text final-text";
                  finalText.textContent = "Building the future with clean code and retro inspiration.";
                  
                  finalLine.appendChild(finalText);
                  containerRef.current.appendChild(finalLine);
                }, 1000);
              })
              .start();
          }, 1500);
        }, 1000);
      })
      .start();
    
    // Subtle animation effect
    const animationInterval = setInterval(() => {
      if (welcomeText) {
        welcomeText.style.opacity = '0.8';
        setTimeout(() => welcomeText.style.opacity = '1', 200);
      }
    }, 5000);
    
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
