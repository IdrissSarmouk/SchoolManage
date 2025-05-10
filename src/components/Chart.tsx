import React, { useEffect, useRef } from 'react';

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    values: number[];
    colors?: string[];
  };
  height?: number;
}

const Chart: React.FC<ChartProps> = ({ type, data, height = 250 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || !data || !data.labels || !data.values) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw based on chart type
    if (type === 'line') {
      drawLineChart(ctx, canvas.width, canvas.height, data);
    } else if (type === 'bar') {
      drawBarChart(ctx, canvas.width, canvas.height, data);
    } else if (type === 'pie') {
      drawPieChart(ctx, canvas.width, canvas.height, data);
    } else if (type === 'doughnut') {
      drawDoughnutChart(ctx, canvas.width, canvas.height, data);
    }
  }, [type, data, height]);
  
  // Draw line chart
  const drawLineChart = (ctx: CanvasRenderingContext2D, width: number, height: number, data: ChartProps['data']) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#d1d5db';
    ctx.stroke();
    
    // Get max value for scaling
    const maxValue = Math.max(...data.values) * 1.2; // Add 20% padding
    
    // Draw points and line
    ctx.beginPath();
    const pointSpacing = chartWidth / (data.values.length - 1);
    
    data.values.forEach((value, index) => {
      const x = padding + index * pointSpacing;
      const y = height - padding - (value / maxValue) * chartHeight;
      
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
    
    data.labels.forEach((label, index) => {
      const x = padding + index * pointSpacing;
      ctx.fillText(label, x, height - padding + 20);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const value = Math.round((maxValue * i) / steps);
      const y = height - padding - (i / steps) * chartHeight;
      ctx.fillText(`${value}`, padding - 10, y + 5);
    }
  };
  
  // Draw bar chart
  const drawBarChart = (ctx: CanvasRenderingContext2D, width: number, height: number, data: ChartProps['data']) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#d1d5db';
    ctx.stroke();
    
    // Get max value for scaling
    const maxValue = Math.max(...data.values) * 1.2; // Add 20% padding
    
    // Draw bars
    const barWidth = (chartWidth / data.values.length) * 0.8;
    const barSpacing = (chartWidth / data.values.length) * 0.2;
    
    data.values.forEach((value, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const barHeight = (value / maxValue) * chartHeight;
      const y = height - padding - barHeight;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, height - padding);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#93c5fd');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw value on top of the bar
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, index) => {
      const x = padding + index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2;
      
      // Add text wrapping for long labels
      const words = label.split(' ');
      let line = '';
      let y = height - padding + 15;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > barWidth * 1.5) {
          ctx.fillText(line, x, y);
          line = word + ' ';
          y += 15;
        } else {
          line = testLine;
        }
      });
      
      ctx.fillText(line, x, y);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const value = Math.round((maxValue * i) / steps);
      const y = height - padding - (i / steps) * chartHeight;
      ctx.fillText(`${value}`, padding - 10, y + 5);
    }
  };
  
  // Draw pie chart
  const drawPieChart = (ctx: CanvasRenderingContext2D, width: number, height: number, data: ChartProps['data']) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    const total = data.values.reduce((sum, value) => sum + value, 0);
    
    // Colors
    const colors = data.colors || [
      '#3b82f6', '#ef4444', '#f97316', '#22c55e', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#14b8a6', '#eab308', '#6366f1'
    ];
    
    // Draw pie segments
    let startAngle = 0;
    
    data.values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
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
    
    // Draw legend
    const legendX = centerX - radius;
    const legendY = height - 30 - data.labels.length * 25;
    
    data.labels.forEach((label, index) => {
      const y = legendY + index * 25;
      
      // Draw color box
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${label} (${data.values[index]})`, legendX + 25, y + 7);
    });
  };
  
  // Draw doughnut chart (new chart type)
  const drawDoughnutChart = (ctx: CanvasRenderingContext2D, width: number, height: number, data: ChartProps['data']) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) - 40;
    const innerRadius = outerRadius * 0.6; // Inner circle size (hole)
    
    const total = data.values.reduce((sum, value) => sum + value, 0);
    
    // Colors
    const colors = data.colors || [
      '#3b82f6', '#ef4444', '#f97316', '#22c55e', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#14b8a6', '#eab308', '#6366f1'
    ];
    
    // Draw segments
    let startAngle = 0;
    
    data.values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      // Draw percentage in the middle of the segment
      const midAngle = startAngle + sliceAngle / 2;
      const x = centerX + Math.cos(midAngle) * (outerRadius + innerRadius) / 2;
      const y = centerY + Math.sin(midAngle) * (outerRadius + innerRadius) / 2;
      
      const percentage = Math.round((value / total) * 100);
      
      if (percentage > 5) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, x, y);
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw center info
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Total:`, centerX, centerY - 10);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`${total}`, centerX, centerY + 15);
    
    // Draw legend
    const legendX = width - 160;
    const legendY = 20;
    
    data.labels.forEach((label, index) => {
      const y = legendY + index * 25;
      
      // Draw color box
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label with value
      ctx.fillStyle = '#374151';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${label} (${data.values[index]})`, legendX + 25, y + 7);
    });
  };

  return (
    <div className="h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  );
};

export default Chart;