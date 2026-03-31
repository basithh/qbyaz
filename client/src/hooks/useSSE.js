import { useState, useEffect, useRef } from 'react'
import { api } from '../api/client'

export function useSSE(slug) {
  const [queueState, setQueueState] = useState(null)
  const [connected, setConnected] = useState(false)
  const esRef = useRef(null)

  useEffect(() => {
    if (!slug) return

    const url = api.getEventsUrl(slug)
    const es = new EventSource(url)
    esRef.current = es

    es.addEventListener('init', (e) => {
      setQueueState(JSON.parse(e.data))
      setConnected(true)
    })

    es.addEventListener('queue_updated', (e) => {
      setQueueState(JSON.parse(e.data))
    })

    es.addEventListener('session_closed', (e) => {
      setQueueState(JSON.parse(e.data))
    })

    es.onerror = () => {
      setConnected(false)
    }

    es.onopen = () => {
      setConnected(true)
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [slug])

  return { queueState, connected }
}
