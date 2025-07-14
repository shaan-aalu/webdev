import React from "react";
import { motion } from "framer-motion";

const AnimatedPlane = () => {
  return (
    <motion.div
      initial={{ x: "-150px" }}
      animate={{ x: "100vw" }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute top-4 left-0 z-10"
    >
      <svg width="100" height="100" viewBox="0 0 100 100">
        <polygon
          points="10,50 90,40 90,60 10,50"
          fill="gray"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
};

export default AnimatedPlane;
