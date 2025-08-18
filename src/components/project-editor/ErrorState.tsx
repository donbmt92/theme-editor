import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  onBack: () => void
}

const ErrorState = ({ onBack }: ErrorStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Project không tồn tại</h1>
        <Button onClick={onBack}>Quay lại</Button>
      </div>
    </div>
  )
}

export default ErrorState
