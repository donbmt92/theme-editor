import { useState, useCallback, useRef } from 'react'

interface UseUndoRedoOptions {
  maxHistory?: number
  debounceMs?: number
}

export function useUndoRedo<T>(
  initialState: T,
  options: UseUndoRedoOptions = {}
) {
  const { maxHistory = 50, debounceMs = 300 } = options
  
  const [currentState, setCurrentState] = useState<T>(initialState)
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const updateState = useCallback((newState: T) => {
    // Clear any pending debounced update
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Debounce the update to avoid too many history entries
    debounceTimeoutRef.current = setTimeout(() => {
      setCurrentState(newState)
      
      setHistory(prevHistory => {
        // Remove any future history if we're not at the end
        const newHistory = prevHistory.slice(0, currentIndex + 1)
        
        // Add new state
        newHistory.push(newState)
        
        // Limit history size
        if (newHistory.length > maxHistory) {
          return newHistory.slice(-maxHistory)
        }
        
        return newHistory
      })
      
      setCurrentIndex(prevIndex => {
        const newIndex = Math.min(prevIndex + 1, maxHistory - 1)
        return newIndex
      })
    }, debounceMs)
  }, [currentIndex, maxHistory, debounceMs])

  const undo = useCallback(() => {
    if (!canUndo) return
    
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex - 1
      setCurrentState(history[newIndex])
      return newIndex
    })
  }, [canUndo, history])

  const redo = useCallback(() => {
    if (!canRedo) return
    
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex + 1
      setCurrentState(history[newIndex])
      return newIndex
    })
  }, [canRedo, history])

  const reset = useCallback((newState?: T) => {
    const stateToReset = newState ?? initialState
    setCurrentState(stateToReset)
    setHistory([stateToReset])
    setCurrentIndex(0)
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
  }, [initialState])

  return {
    state: currentState,
    updateState,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historyLength: history.length,
    currentIndex
  }
} 