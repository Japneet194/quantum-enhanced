import * as React from 'react';
import { SignIn, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
  const { isSignedIn } = useClerkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate('/', { replace: true });
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        appearance={{ elements: { formButtonPrimary: 'bg-primary hover:bg-primary/90' } }}
        // Clerk automatically shows Email/Password; to ensure providers are visible, enable them in Clerk Dashboard.
        // The component will display "Continue with Google/Apple" buttons when configured.
      />
    </div>
  );
};

export default SignInPage;
