import React, { useEffect, useRef } from 'react';

export const Background3D = () => {
  const canvasRef = useRef(null);
  const bgImgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse Parallax coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      targetX = (e.clientX - width / 2) / (width / 2);
      targetY = (e.clientY - height / 2) / (height / 2);

      // Also apply CSS 3D transform to the background image container
      if (bgImgRef.current) {
        const tiltX = -targetY * 8; // degrees
        const tiltY = targetX * 10;
        const moveX = targetX * 18;
        const moveY = targetY * 18;
        bgImgRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${moveX}px, ${moveY}px, 0px) scale(1.05)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Floating 3D glowing particles
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02 + 0.006,
      depth: Math.random() * 0.8 + 0.2
    }));

    // Floating tactical HUD data points
    const hudNodes = Array.from({ length: 6 }, (_, i) => ({
      x: width * 0.78 + (Math.random() * 120 - 60),
      y: height * 0.22 + i * 85,
      label: `UAV_TEL_NODE_${101 + i}`,
      value: (Math.random() * 80 + 20).toFixed(1),
      alpha: 0.35 + Math.random() * 0.35
    }));

    let rotationAngle = 0;
    let scanY = 0;

    const render = () => {
      // Smooth lerp mouse parallax
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Vertical Futuristic Scan Line Wave
      scanY = (scanY + 1.4) % height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 35, 0, scanY + 35);
      scanGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.08)');
      scanGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 35, width, 70);

      // Floating 3D Particles with glowing cyan trails
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += p.pulse;

        if (p.alpha > 0.85 || p.alpha < 0.2) p.pulse = -p.pulse;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const px = p.x + mouseX * 25 * p.depth;
        const py = p.y + mouseY * 25 * p.depth;

        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f0ff';
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Holographic HUD Rotating Blueprint Rings (Upper Right / Center depth)
      const ringCenterX = width * 0.75 + mouseX * 30;
      const ringCenterY = height * 0.42 + mouseY * 30;
      rotationAngle += 0.006;

      ctx.save();
      ctx.translate(ringCenterX, ringCenterY);

      // Outer dashed cyan ring
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([14, 8, 4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, 160, rotationAngle, rotationAngle + Math.PI * 2);
      ctx.stroke();

      // Inner electric blue ring (reverse spin)
      ctx.strokeStyle = 'rgba(26, 117, 255, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([18, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 120, -rotationAngle * 1.3, -rotationAngle * 1.3 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center crosshair
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.moveTo(0, -20);
      ctx.lineTo(0, 20);
      ctx.stroke();

      ctx.restore();

      // Draw floating technical HUD labels
      hudNodes.forEach((node, idx) => {
        const floatY = node.y + Math.sin(rotationAngle * 2 + idx) * 6;
        ctx.fillStyle = `rgba(0, 240, 255, ${node.alpha})`;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`${node.label}: ${node.value}`, node.x + mouseX * 15, floatY + mouseY * 15);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-navy-950">
      {/* 1st Uploaded Image: Futuristic Hangar & MALE UAV Drone in 3D animated transparent form */}
      <div
        ref={bgImgRef}
        className="absolute inset-[-40px] transition-transform duration-300 ease-out will-change-transform"
        style={{
          backgroundImage: `url('/assets/bg_uav_hangar.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.28,
          filter: 'contrast(1.15) brightness(0.85)',
          transform: 'perspective(1000px) scale(1.05)',
        }}
      />

      {/* Futuristic Deep Vignette & Aerospace Gradient Overlays */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(3,6,17,0.45) 0%, rgba(3,6,17,0.85) 65%, rgba(3,6,17,0.96) 100%)'
        }}
      />

      {/* Cyber Grid Lines Overlay */}
      <div 
        className="absolute inset-0 cyber-grid opacity-30"
        style={{ backgroundSize: '45px 45px' }}
      />

      {/* Canvas for 3D animated particles, holographic rings, scan waves, and HUD nodes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
