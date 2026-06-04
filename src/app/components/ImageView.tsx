import React, { useState, useRef, useEffect } from 'react';
import { Maximize, ZoomIn, ZoomOut, Download, Copy, Check } from 'lucide-react';

interface ImageViewProps {
  src: string;
  alt?: string;
}

export const ImageView: React.FC<ImageViewProps> = ({ src, alt }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    // Zoom goes from 5% to 1,000% in intervals of 5% (0.05)
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newZoom = Math.min(Math.max(0.05, zoom + delta), 10);
    // Round to nearest 0.05
    setZoom(Math.round(newZoom * 20) / 20);
  };

  useEffect(() => {
    if (src.startsWith('http') && !src.includes('localhost')) {
      // Automatic download and conversion to PNG
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'web-image.png';
              a.click();
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        }
      };
      img.src = src;
    }
  }, [src]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const fitToWindow = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      // Mocking image dimensions for fit-to-window calculation
      // In a real scenario we'd wait for image load
      setZoom(0.8); 
      setPosition({ x: 0, y: 0 });
    }
  };

  const zoom100 = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCopy = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy image', err);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = 'image.png';
    a.click();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button onClick={fitToWindow} className="p-2 bg-lavender-surface rounded hover:bg-lavender-accent" title="Fit to window"><Maximize size={16} /></button>
        <button onClick={zoom100} className="p-2 bg-lavender-surface rounded hover:bg-lavender-accent" title="Zoom 100%">100%</button>
        <button onClick={handleCopy} className="p-2 bg-lavender-surface rounded hover:bg-lavender-accent">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <button onClick={handleDownload} className="p-2 bg-lavender-surface rounded hover:bg-lavender-accent"><Download size={16} /></button>
      </div>
      <div 
        ref={containerRef}
        className="flex-1 cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          src={src} 
          alt={alt}
          referrerPolicy="no-referrer"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            transformOrigin: 'center',
          }}
          className="max-w-none pointer-events-none"
        />
      </div>
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};
