import { css } from "@emotion/react";
import { motion } from "framer-motion";

export function Sphere({ cssStyle }) {
  return (
    <motion.div
      css={css`
        ${cssStyle}
        position: absolute;
        background: linear-gradient(
          180deg,
          rgba(255, 107, 0, 0.82) 0%,
          #ff4d00 89.85%
        );
        border-radius: 90%;
      `}
      animate={{
        rotate: 360,
      }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        easings: ["linear"],
      }}
    />
  );
}
