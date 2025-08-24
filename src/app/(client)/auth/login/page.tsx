import LoginFormRegular from "@/components/auth/LoginFormRegular"
import AuthRedirect from "@/components/auth/AuthRedirect"

const LoginRegular = () => {
  return (
    <AuthRedirect>
      <LoginFormRegular/>
    </AuthRedirect>
  )
}

export default LoginRegular