import { motion } from 'framer-motion'

interface ThinkingDotsProps {
  label?: string
}

export function ThinkingDots({ label }: ThinkingDotsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 py-2"
      style={{ backgroundColor: 'transparent', border: 'none' }}
    >
      <div className="flex gap-1.5 items-center">
        {[0, 0.5, 1].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: '#0f172a' }}
          />
        ))}
      </div>
      {label && (
        <span className="text-sm font-medium" style={{ color: 'rgba(71,85,105,1)' }}>
          {label}
        </span>
      )}
    </motion.div>
  )
}
