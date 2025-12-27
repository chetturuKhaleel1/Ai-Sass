import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import React from "react";

export default function ParallaxCard({ children, className = "" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for "heavy" feel
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-7, 7]);

  function handleMouse(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate normalized position (-0.5 to 0.5)
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className={`transform-gpu ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
    >
      {children}
    </motion.div>
  );
}
