type TaskFunction<T> = () => Promise<T>
type TaskResult<T> = { success: true; data: T } | { success: false; error: string }

interface QueuedTask<T> {
  id: string
  task: TaskFunction<T>
  priority: number
  createdAt: number
  timeout: number
  resolve: (result: TaskResult<T>) => void
  reject: (error: Error) => void
}

interface QueueConfig {
  maxConcurrentTasks: number
  maxQueueSize: number
  defaultTimeout: number
  priorityThreshold: number
}

interface QueueStats {
  activeTasks: number
  queuedTasks: number
  completedTasks: number
  failedTasks: number
  averageWaitTime: number
  averageTaskTime: number
}

class AsyncQueue<T> {
  private queue: QueuedTask<T>[] = []
  private activeTasks = new Map<string, Promise<any>>()
  private completedTasks = 0
  private failedTasks = 0
  private taskTimes: number[] = []
  private waitTimes: number[] = []
  
  constructor(private config: QueueConfig) {}

  async enqueue(
    id: string,
    task: TaskFunction<T>,
    priority: number = 0,
    timeout?: number
  ): Promise<TaskResult<T>> {
    return new Promise((resolve, reject) => {
      // Check queue capacity
      if (this.queue.length >= this.config.maxQueueSize) {
        resolve({
          success: false,
          error: 'Queue is full. Please try again later.'
        })
        return
      }

      // Check for duplicate tasks
      if (this.activeTasks.has(id) || this.queue.some(t => t.id === id)) {
        resolve({
          success: false,
          error: 'Task already in progress or queued.'
        })
        return
      }

      const queuedTask: QueuedTask<T> = {
        id,
        task,
        priority,
        createdAt: Date.now(),
        timeout: timeout || this.config.defaultTimeout,
        resolve,
        reject
      }

      // Insert by priority (higher priority first)
      const insertIndex = this.queue.findIndex(t => t.priority < priority)
      if (insertIndex === -1) {
        this.queue.push(queuedTask)
      } else {
        this.queue.splice(insertIndex, 0, queuedTask)
      }

      // Process queue if we have capacity
      this.processQueue()
    })
  }

  private async processQueue(): Promise<void> {
    if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
      return // At capacity
    }

    const task = this.queue.shift()
    if (!task) {
      return // No tasks to process
    }

    const waitTime = Date.now() - task.createdAt
    this.waitTimes.push(waitTime)

    // Execute task with timeout
    const taskPromise = this.executeTask(task)
    this.activeTasks.set(task.id, taskPromise)

    taskPromise.finally(() => {
      this.activeTasks.delete(task.id)
      this.processQueue() // Process next task
    })
  }

  private async executeTask(task: QueuedTask<T>): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Task timeout after ${task.timeout}ms`))
        }, task.timeout)
      })

      // Race between task completion and timeout
      const result = await Promise.race([
        task.task(),
        timeoutPromise
      ])

      const taskTime = Date.now() - startTime
      this.taskTimes.push(taskTime)
      this.completedTasks++

      task.resolve({
        success: true,
        data: result
      })

      console.log(`✅ Task ${task.id} completed in ${taskTime}ms`)
    } catch (error) {
      const taskTime = Date.now() - startTime
      this.taskTimes.push(taskTime)
      this.failedTasks++

      task.resolve({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      console.log(`❌ Task ${task.id} failed after ${taskTime}ms:`, error)
    }
  }

  private removeTask(id: string): boolean {
    const index = this.queue.findIndex(t => t.id === id)
    if (index !== -1) {
      this.queue.splice(index, 1)
      return true
    }
    return false
  }

  cancel(id: string): boolean {
    // Check if task is active
    const activePromise = this.activeTasks.get(id)
    if (activePromise) {
      // Can't cancel active tasks, but can reject the promise
      return false
    }

    // Remove from queue
    return this.removeTask(id)
  }

  getStats(): QueueStats {
    const avgWaitTime = this.waitTimes.length > 0 
      ? this.waitTimes.reduce((a, b) => a + b, 0) / this.waitTimes.length 
      : 0
    
    const avgTaskTime = this.taskTimes.length > 0
      ? this.taskTimes.reduce((a, b) => a + b, 0) / this.taskTimes.length
      : 0

    return {
      activeTasks: this.activeTasks.size,
      queuedTasks: this.queue.length,
      completedTasks: this.completedTasks,
      failedTasks: this.failedTasks,
      averageWaitTime: Math.round(avgWaitTime),
      averageTaskTime: Math.round(avgTaskTime)
    }
  }

  clear(): void {
    // Reject all queued tasks
    for (const task of this.queue) {
      task.reject(new Error('Queue cleared'))
    }
    
    this.queue = []
    this.activeTasks.clear()
    this.completedTasks = 0
    this.failedTasks = 0
    this.taskTimes = []
    this.waitTimes = []
  }
}

// AI Generation Queue - optimized for truly concurrent processing (non-blocking)
export const aiGenerationQueue = new AsyncQueue<any>({
  maxConcurrentTasks: 200,   // Process 200 AI requests simultaneously (true parallelism for 500 users)
  maxQueueSize: 5000,        // Allow up to 5000 requests in queue (high volume capacity)
  defaultTimeout: 60000,     // 60 seconds timeout (optimized for parallel processing)
  priorityThreshold: 0.7     // Lower threshold for better distribution
})

// Business info based priority calculator
export function calculatePriority(businessInfo: any): number {
  let priority = 0.5 // Base priority

  // Higher priority for different business contexts
  if (businessInfo.industry?.toLowerCase().includes('urgent')) {
    priority += 0.3
  }
  
  if (businessInfo.language === 'english') {
    priority += 0.1 // English requests get slight priority
  }

  // Premium company sizes get higher priority
  if (businessInfo.companyName?.length > 20) {
    priority += 0.1
  }

  // Random offset to prevent priority clustering
  priority += Math.random() * 0.05

  return Math.min(priority, 1.0) // Cap at 1.0
}

// Queue monitoring utilities
export function getQueueStats(): QueueStats {
  return aiGenerationQueue.getStats()
}

export function isQueueHealthy(): boolean {
  const stats = getQueueStats()
  const avgWaitTimeMinutes = stats.averageWaitTime / 1000 / 60
  
  // If queue is completely empty, always consider healthy (fresh start)
  if (stats.queuedTasks === 0 && stats.activeTasks === 0) {
    console.log('🆕 Fresh Queue State - Always Healthy')
    return true
  }
  
  // Queue is healthy if:
  // - Less than 4000 requests in queue (supporting 500 concurrent users)
  // - Average wait time less than 3 minutes (faster non-blocking requirements)
  // - Failure rate less than 15% (higher reliability for concurrent processing)
  const totalTasks = stats.completedTasks + stats.failedTasks
  const failureRate = totalTasks > 0 ? stats.failedTasks / totalTasks : 0
  
  const isHealthy = stats.queuedTasks < 4000 && 
                    avgWaitTimeMinutes < 3 && 
                    failureRate < 0.15
  
  // Debug logging
  console.log('🔍 Queue Health Check:', {
    queuedTasks: stats.queuedTasks,
    activeTasks: stats.activeTasks,
    completedTasks: stats.completedTasks,
    failedTasks: stats.failedTasks,
    avgWaitTimeMinutes: avgWaitTimeMinutes.toFixed(2),
    failureRate: failureRate.toFixed(3),
    thresholds: {
      maxQueue: 4000,
      maxWaitTime: 3,
      maxFailureRate: 0.15
    },
    isHealthy,
    freshStart: stats.queuedTasks === 0 && stats.activeTasks === 0
  })

  return isHealthy
}

export default AsyncQueue
