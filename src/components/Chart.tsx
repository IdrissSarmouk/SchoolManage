import React, { useEffect, useRef } from 'react';

// Mock chart component for demonstration purposes
// In a real app, you'd use a charting library like Chart.js, ApexCharts, etc.
const Chart: React.FC<{ type: 'line' | 'bar' | 'pie' }> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw based on chart type
    if (type === 'line') {
      drawLineChart(ctx, canvas.width, canvas.height);
    } else if (type === 'bar') {
      drawBarChart(ctx, canvas.width, canvas.height);
    } else if (type === 'pie') {
      drawPieChart(ctx, canvas.width, canvas.height);
    }
  }, [type]);
  
  // Draw line chart
  const drawLineChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Generate random data
    const data = Array.from({ length: 6 }, () => Math.floor(Math.random() * 60) + 20);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#d1d5db';
    ctx.stroke();
    
    // Draw points and line
    ctx.beginPath();
    const pointSpacing = chartWidth / (data.length - 1);
    
    data.forEach((value, index) => {
      const x = padding + index * pointSpacing;
      const y = height - padding - (value / 100) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw point
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Style and stroke the line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    
    data.forEach((_, index) => {
      const x = padding + index * pointSpacing;
      ctx.fillText(months[index], x, height - padding + 20);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i += 2) {
      const y = height - padding - (i / 10) * chartHeight;
      ctx.fillText(`${i * 10}`, padding - 10, y + 5);
    }
  };
  
  // Draw bar chart
  const drawBarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Generate random data
    const data = Array.from({ length: 6 }, () => Math.floor(Math.random() * 60) + 20);
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#d1d5db';
    ctx.stroke();
    
    // Draw bars
    const barWidth = (chartWidth / data.length) * 0.8;
    const barSpacing = (chartWidth / data.length) * 0.2;
    
    data.forEach((value, index) => {
      const x = padding + index * (barWidth + barSpacing);
      const barHeight = (value / 100) * chartHeight;
      const y = height - padding - barHeight;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, height - padding);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#93c5fd');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    
    data.forEach((_, index) => {
      const x = padding + index * (barWidth + barSpacing) + barWidth / 2;
      ctx.fillText(months[index], x, height - padding + 20);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i += 2) {
      const y = height - padding - (i / 10) * chartHeight;
      ctx.fillText(`${i * 10}`, padding - 10, y + 5);
    }
  };
  
  // Draw pie chart
  const drawPieChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Generate random data
    const data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 30) + 10);
    const total = data.reduce((sum, value) => sum + value, 0);
    
    // Colors
    const colors = ['#3b82f6', '#f97316', '#22c55e', '#8b5cf6', '#ef4444'];
    
    // Draw pie segments
    let startAngle = 0;
    
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index];
      ctx.fill();
      
      // Draw percentage in the middle of the slice
      const midAngle = startAngle + sliceAngle / 2;
      const x = centerX + Math.cos(midAngle) * (radius * 0.7);
      const y = centerY + Math.sin(midAngle) * (radius * 0.7);
      
      const percentage = Math.round((value / total) * 100);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (percentage > 5) {
        ctx.fillText(`${percentage}%`, x, y);
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw a white circle in the middle for a donut chart
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Draw legend
    const legendItems = ['Mathématiques', 'Français', 'Histoire-Géo', 'Sciences', 'Anglais'];
    const legendX = centerX - 80;
    const legendY = centerY - 20;
    
    legendItems.forEach((item, index) => {
      const y = legendY + index * 25;
      
      // Draw color box
      ctx.fillStyle = colors[index];
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item, legendX + 25, y + 7);
    });
  };

  return (
    <div className="h-64 w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  );
};

export default Chart;