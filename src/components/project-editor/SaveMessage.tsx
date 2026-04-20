interface SaveMessageProps {
  message: string
}

const SaveMessage = ({ message }: SaveMessageProps) => {
  if (!message) return null

  const isSuccess = message.includes('✅')
  
  return (
    <div className={`px-6 py-3 text-sm font-medium ${
      isSuccess 
        ? 'bg-green-50 text-green-800 border-b border-green-200' 
        : 'bg-red-50 text-red-800 border-b border-red-200'
    }`}>
      {message}
    </div>
  )
}

export default SaveMessage
