import { motion } from "framer-motion";

export function HeroGraphic() {
  return (
    <div className="absolute top-[5%] md:top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none z-[-1] opacity-60">
      <svg
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="synthFade" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.2" /> {/* emerald-600 */}
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" /> {/* emerald-500 */}
            <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="glowG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" /> {/* emerald-400 */}
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="synthGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central glowing orb */}
        <motion.circle
          cx="400"
          cy="400"
          r="120"
          fill="url(#synthFade)"
          filter="url(#synthGlow)"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 0.9, 1], opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Inner high-energy ring */}
        <motion.circle
          cx="400"
          cy="400"
          r="150"
          stroke="url(#glowG)"
          strokeWidth="2"
          strokeDasharray="10 20"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        />

        {/* Nodes and intricate cyber lines */}
        {[
          { cx: 200, cy: 300, d: "M 200 300 L 400 400" },
          { cx: 600, cy: 250, d: "M 600 250 L 400 400" },
          { cx: 250, cy: 600, d: "M 250 600 L 400 400" },
          { cx: 650, cy: 550, d: "M 650 550 L 400 400" },
          { cx: 400, cy: 150, d: "M 400 150 L 400 400" },
        ].map((node, i) => (
          <g key={i}>
            <motion.path
              d={node.d}
              stroke="url(#glowG)"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.3, ease: "easeInOut" }}
            />
            {/* Pulsing data dots along lines */}
            <motion.circle
              r="4"
              fill="#10b981"
              filter="url(#synthGlow)"
            >
              <animateMotion
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
                path={node.d}
              />
            </motion.circle>
            {/* Static outer node blobs */}
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r="6"
              fill="#34d399"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 1 + i * 0.2 }}
            />
          </g>
        ))}

        {/* Decorative Grid Circles */}
        <motion.circle
          cx="400"
          cy="400"
          r="300"
          stroke="#059669"
          strokeWidth="1"
          strokeOpacity="0.15"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.circle
          cx="400"
          cy="400"
          r="400"
          stroke="#10b981"
          strokeWidth="1"
          strokeOpacity="0.05"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5 }}
        />
      </svg>
    </div>
  );
}
