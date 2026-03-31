import { AnimatePresence } from 'framer-motion'
import TokenCard from './TokenCard'

export default function QueueList({ tokens, renderActions, emptyMessage = 'No tokens yet' }) {
  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {tokens.map((token, index) => (
          <TokenCard
            key={token.id}
            token={token}
            index={index}
            actions={renderActions?.(token)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
