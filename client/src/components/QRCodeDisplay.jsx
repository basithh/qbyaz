import { motion } from 'framer-motion'
import { api } from '../api/client'
import { Download, QrCode } from 'lucide-react'

export default function QRCodeDisplay({ slug, size = 200 }) {
  const qrUrl = api.getQrUrl(slug)

  const handleDownload = async () => {
    const response = await fetch(qrUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `queue-${slug}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="glass-light rounded-2xl p-4 inline-block">
        <div className="bg-white rounded-xl p-3">
          <img
            src={qrUrl}
            alt="QR Code"
            width={size}
            height={size}
            className="block"
          />
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        className="flex items-center gap-2 text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
      >
        <Download size={14} />
        Download QR Code
      </motion.button>
    </motion.div>
  )
}
