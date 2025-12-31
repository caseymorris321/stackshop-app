import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/clerk-react'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-b from-sky-50 to-white">
      <SignUp
        routing="hash"
        signInUrl="/login"
        afterSignUpUrl="/"
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'shadow-lg',
          },
        }}
      />
    </div>
  )
}
