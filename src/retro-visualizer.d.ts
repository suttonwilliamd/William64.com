declare module 'retro-visualizer' {
  export class RetroVisualizer {
    constructor(canvas: HTMLCanvasElement, options?: object);
    setTheme(theme: string): this;
    setData(data: number[]): this;
    setSize(width: number, height: number): this;
    generateData(points?: number): this;
    renderVisualization(): void;
    currentViz: 'bar' | 'line' | 'scatter';
  }
}