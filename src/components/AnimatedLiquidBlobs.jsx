import { motion } from "framer-motion";

export default function AnimatedLiquidBlobs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.svg
        viewBox="0 0 800 600"
        className="w-[1200px] h-[700px] opacity-80"
        initial={{ y: -40 }}
        animate={{ y: 0 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 8 }}
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        <motion.path
          d="M120 80C180 20 320 10 420 60C520 110 650 140 720 200C790 260 740 380 640 420C540 460 360 450 240 420C120 390 60 220 120 80Z"
          fill="url(#g1)"
          opacity="0.85"
          transform="translate(-30, -20)"
          animate={{
            transform: ["translate(-30, -20)", "translate(10, 10)", "translate(-30, -20)"],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.path
          d="M60 300C100 260 220 240 320 260C420 280 500 320 620 340C740 360 780 480 700 520C620 560 480 560 360 540C240 520 80 420 60 300Z"
          fill="url(#g2)"
          opacity="0.7"
          animate={{
            transform: ["translate(0,0)", "translate(-20,20)", "translate(0,0)"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}
