import React, { useState, useRef } from 'react';

function StockChart({ data = [], isUp = true }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const containerRef = useRef(null);

  if (data.length === 0) {
    return (
      <div className="w-full h-64 bg-toss-gray-100 dark:bg-toss-dark-card rounded-toss flex items-center justify-between text-toss-gray-400">
        데이터가 없습니다.
      </div>
    );
  }

  // Dimensions
  const width = 600;
  const height = 280;
  const padding = 20;

  // Min-Max Prices for Scaling
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices) * 0.995;
  const maxPrice = Math.max(...prices) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  // Map Data Points to SVG Space
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.price - minPrice) / priceRange) * (height - padding * 2);
    return { x, y, price: d.price, timestamp: d.timestamp };
  });

  // Construct SVG Path String
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathD += ` L ${points[i].x} ${points[i].y}`;
  }

  // Construct Area Under the Curve Path String
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  // Color Definitions
  const strokeColor = isUp ? 'var(--stock-up)' : 'var(--stock-down)';
  const gradientId = `chartGradient-${isUp ? 'up' : 'down'}`;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const svgX = (x / rect.width) * width;

    // Find closest index based on X coordinate
    let closestIndex = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    setHoverIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div className="relative w-full" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      
      {/* Dynamic Hover Details Panel */}
      {hoverIndex !== null && (
        <div className="absolute top-2 left-4 px-3 py-2 rounded-toss-sm bg-white/90 dark:bg-toss-dark-card/90 border border-toss-gray-200 dark:border-toss-dark-border text-xs shadow-toss pointer-events-none transition-all">
          <p className="text-toss-gray-400 font-semibold">{new Date(points[hoverIndex].timestamp).toLocaleDateString()}</p>
          <p className="text-base font-extrabold" style={{ color: strokeColor }}>
            ₩{points[hoverIndex].price.toLocaleString()}
          </p>
        </div>
      )}

      {/* SVG Canvas */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        
        {/* Gradients definitions */}
        <defs>
          <linearGradient id="gradient-up" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--stock-up)" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="var(--stock-up)" stopOpacity="0.0"/>
          </linearGradient>
          <linearGradient id="gradient-down" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--stock-down)" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="var(--stock-down)" stopOpacity="0.0"/>
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3"/>
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3"/>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3"/>

        {/* Area fill */}
        <path d={areaD} fill={`url(#gradient-${isUp ? 'up' : 'down'})`} className="chart-area"/>

        {/* Curve stroke */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3" className="chart-line"/>

        {/* Hover elements */}
        {hoverIndex !== null && (
          <>
            {/* Vertical assist line */}
            <line 
              x1={points[hoverIndex].x} 
              y1={padding} 
              x2={points[hoverIndex].x} 
              y2={height - padding} 
              stroke="var(--text-tertiary)" 
              strokeWidth="1.5" 
              strokeDasharray="4 4"
            />
            {/* Pulse outer glow */}
            <circle 
              cx={points[hoverIndex].x} 
              cy={points[hoverIndex].y} 
              r="8" 
              fill={strokeColor} 
              opacity="0.3"
            />
            {/* Focal inner circle */}
            <circle 
              cx={points[hoverIndex].x} 
              cy={points[hoverIndex].y} 
              r="4.5" 
              fill="white" 
              stroke={strokeColor} 
              strokeWidth="3.5"
            />
          </>
        )}
      </svg>
    </div>
  );
}

export default StockChart;
