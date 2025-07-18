import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const AnimatedPlane = () => {
  const planeRef = useRef(null);

  useEffect(() => {
    gsap.to(planeRef.current, {
      duration: 6,
      repeat: -1,
      ease: "power1.inOut",
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: 200, y: -80 },
          { x: 400, y: 0 },
          { x: 600, y: -120 },
          { x: 800, y: 0 },
        ],
        curviness: 1.25,
        autoRotate: true,
      },
    });
  }, []);

  return (
    <svg
      ref={planeRef}
      className="w-16 h-auto absolute top-10 left-0"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M476 252L32 120v40l120 72v48l-120 72v40l444-132c20-6 20-30 0-36z"
        fill="#1E90FF"
      />
      <path
        d="M200 192h-40l-32-48h-32l24 48H80l32 32h40l-32 48h32l32-48h40z"
        fill="#0056b3"
      />
    </svg>
  );
};

export default AnimatedPlane;
