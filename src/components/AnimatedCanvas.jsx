import React, { useRef, useEffect } from "react";
import "./AnimatedCanvas.css";
const AnimatedCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let x = 0;

    const animate = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width; // Set canvas width for drawing
      canvas.height = height; // Set canvas height for drawing

      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      context.beginPath();
      context.arc(x, canvas.height / 2, 50, 0, 2 * Math.PI); // Draw a circle
      context.fillStyle = "blue";
      context.fill();
      x += 2; // Move the circle horizontally
      if (x > canvas.width) x = 0; // Reset position when off screen
      requestAnimationFrame(animate); // Schedule the next frame
    };

    animate(); // Start the animation
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef}>
        Your browser does not support the canvas element.
      </canvas>
    </div>
  );
};

export default AnimatedCanvas;
