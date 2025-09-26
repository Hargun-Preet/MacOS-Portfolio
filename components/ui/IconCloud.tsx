"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

interface Icon {
  x: number;
  y: number;
  z: number;
  id: number;
  name: string;
}

// TWEAK: Ref to store animation properties that change every frame
// This avoids re-renders and improves performance
interface IconAnimProps {
  [id: number]: {
    currentScale: number;
  };
}

interface IconCloudProps {
  iconData: {
    name: string;
    icon?: React.ReactNode;
    imageUrl?: string;
  }[];
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ iconData }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [hoveredIcon, setHoveredIcon] = useState<Icon | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const rotationRef = useRef({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);
  // TWEAK: useRef to manage the animation properties for each icon
  const iconAnimProps = useRef<IconAnimProps>({});
  
  const animationFrameRef = useRef<number>(0);

  // Create icon canvases
  useEffect(() => {
    if (!iconData) return;
    imagesLoadedRef.current = new Array(iconData.length).fill(false);
    const newIconCanvases = iconData.map((item, index) => {
      // ... (canvas creation logic remains the same)
      const offscreen = document.createElement("canvas");
      offscreen.width = 40;
      offscreen.height = 40;
      const offCtx = offscreen.getContext("2d");
      if (offCtx) {
        if (item.imageUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = item.imageUrl;
          img.onload = () => {
            offCtx.clearRect(0,0,offscreen.width,offscreen.height);
            offCtx.beginPath(); offCtx.arc(20,20,23,0,Math.PI*2); offCtx.closePath(); offCtx.clip();
            offCtx.drawImage(img, 0, 0, 40, 40);
            imagesLoadedRef.current[index] = true;
          };
        } else if (item.icon) {
          offCtx.scale(0.4, 0.4);
          const svgString = renderToString(item.icon as React.ReactElement);
          const img = new Image();
          img.src = "data:image/svg+xml;base64," + btoa(svgString);
          img.onload = () => {
            offCtx.clearRect(0,0,offscreen.width,offscreen.height);
            offCtx.drawImage(img, 0, 0);
            imagesLoadedRef.current[index] = true;
          };
        }
      }
      return offscreen;
    });
    iconCanvasesRef.current = newIconCanvases;
  }, [iconData]);

  // Generate initial icon positions
  useEffect(() => {
    const newIcons: Icon[] = [];
    const numIcons = iconData.length;
    iconAnimProps.current = {}; // TWEAK: Reset animation props
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      newIcons.push({ x: x * 125, y: y * 125, z: z * 125, id: i, name: iconData[i].name });
      // TWEAK: Initialize animation properties for each icon
      iconAnimProps.current[i] = { currentScale: 1 };
    }
    setIconPositions(newIcons);
  }, [iconData]);
  
  // Handle mouse events (no changes here)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => { /* ... */ setIsDragging(true); setLastMousePos({ x: e.clientX, y: e.clientY });};
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect || !canvasRef.current) return;
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    setMousePos({ x, y });
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.x; const deltaY = e.clientY - lastMousePos.y;
      rotationRef.current = { x: rotationRef.current.x + deltaY * 0.002, y: rotationRef.current.y + deltaX * 0.002 };
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      let foundIcon = null;
      for (const icon of iconPositions) {
        const cosX = Math.cos(rotationRef.current.x); const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y); const sinY = Math.sin(rotationRef.current.y);
        const rotatedX = icon.x * cosY - icon.z * sinY; const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;
        const screenX = canvasRef.current.width / 2 + rotatedX;
        const screenY = canvasRef.current.height / 2 + rotatedY;
        const animProps = iconAnimProps.current[icon.id];
        if (!animProps) continue;
        const radius = 20 * animProps.currentScale * ((rotatedZ + 200) / 300);
        const dx = x - screenX; const dy = y - screenY;
        if (dx * dx + dy * dy < radius * radius) { foundIcon = icon; break; }
      }
      setHoveredIcon(foundIcon);
    }
  };
  const handleMouseUp = () => { setIsDragging(false); };
  const handleMouseLeave = () => { setIsDragging(false); setHoveredIcon(null); };

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // TWEAK: Slow down rotation on hover
      const speedMultiplier = hoveredIcon ? 0.2 : 1;
      if (!isDragging) {
        const centerX = canvas.width / 2; const centerY = canvas.height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const dx = mousePos.x - centerX; const dy = mousePos.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = (0.003 + (distance / maxDistance) * 0.01) * speedMultiplier;
        rotationRef.current = {
          x: rotationRef.current.x + (dy / canvas.height) * speed,
          y: rotationRef.current.y + (dx / canvas.width) * speed,
        };
      }

      const sortedIcons = [...iconPositions].sort((a, b) => {
        const rotatedAZ = a.x * Math.sin(rotationRef.current.y) + a.z * Math.cos(rotationRef.current.y);
        const rotatedBZ = b.x * Math.sin(rotationRef.current.y) + b.z * Math.cos(rotationRef.current.y);
        return rotatedAZ - rotatedBZ;
      });

      let hoveredIconCalculatedProps: any = null;

      // TWEAK: First loop to draw all icons
      sortedIcons.forEach((icon) => {
        const cosX = Math.cos(rotationRef.current.x); const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y); const sinY = Math.sin(rotationRef.current.y);
        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX + rotatedZ * sinX;

        const isHovered = hoveredIcon?.id === icon.id;
        const baseScale = (rotatedZ + 200) / 300;
        
        // TWEAK: Smoothly animate the scale
        const animProps = iconAnimProps.current[icon.id];
        const targetScale = isHovered ? baseScale * 1.5 : baseScale;
        animProps.currentScale += (targetScale - animProps.currentScale) * 0.1; // Easing
        
        // TWEAK: Fade out non-hovered icons (blur alternative)
        const opacity = (hoveredIcon && !isHovered) ? 0.3 : Math.max(0.2, Math.min(1, (rotatedZ + 150) / 200));
        
        ctx.save();
        ctx.translate(canvas.width / 2 + rotatedX, canvas.height / 2 + rotatedY);
        ctx.scale(animProps.currentScale, animProps.currentScale);
        ctx.globalAlpha = opacity;
        
        if (iconCanvasesRef.current[icon.id] && imagesLoadedRef.current[icon.id]) {
          ctx.drawImage(iconCanvasesRef.current[icon.id], -20, -20, 40, 40);
        }
        ctx.restore();

        // TWEAK: If this is the hovered icon, save its properties for later
        if (isHovered) {
          hoveredIconCalculatedProps = { x: rotatedX, y: rotatedY, icon };
        }
      });
      
      // TWEAK: Second step to draw the tooltip on top of everything
      if (hoveredIconCalculatedProps) {
        const { x, y, icon } = hoveredIconCalculatedProps;
        ctx.save();
        ctx.translate(canvas.width / 2 + x, canvas.height / 2 + y);
        ctx.font = "14px Inter, sans-serif";
        const textWidth = ctx.measureText(icon.name).width;
        const padding = 5;
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.beginPath();
        ctx.roundRect(-textWidth / 2 - padding, 30, textWidth + (padding * 2), 24, 5);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(icon.name, 0, 30 + 12);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(animationFrameRef.current); };
  }, [iconData, iconPositions, isDragging, mousePos, hoveredIcon]);

  return (
    <canvas
      ref={canvasRef}
      width={400} height={400}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}
      className="rounded-lg cursor-default active:cursor-pointer"
      aria-label="Interactive 3D Icon Cloud" role="img"
    />
  );
}