import SignupFormRegular from "@/components/auth/SignUpFormRegular"
import AuthRedirect from "@/components/auth/AuthRedirect"

const SignUpPage = () => {
  return (
    <AuthRedirect>
      <SignupFormRegular/>
    </AuthRedirect>
  )
}

export default SignUpPage