'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const EditorRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/templates')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="coffee-spinner mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng đến trang templates...</p>
      </div>
    </div>
  )
}

export default EditorRedirect 