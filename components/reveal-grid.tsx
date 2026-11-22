"use client"

import { Children, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export function RevealGrid({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) {
  const reduceMotion = useReducedMotion()
  const cards = Children.toArray(children)

  const cardVariants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.48,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        visible: {
          transition: reduceMotion
            ? { staggerChildren: 0 }
            : { delayChildren: 0.04, staggerChildren: 0.075 },
        },
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          className="reveal-grid-item"
          key={index}
          variants={cardVariants}
        >
          {card}
        </motion.div>
      ))}
    </motion.div>
  )
}
