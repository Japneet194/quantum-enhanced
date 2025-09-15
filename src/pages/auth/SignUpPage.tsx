import * as React from 'react';
import { SignUp, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  const { isSignedIn } = useClerkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate('/', { replace: true });
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
        appearance={{ elements: { formButtonPrimary: 'bg-primary hover:bg-primary/90' } }}
      />
    </div>
  );
};

export default SignUpPage;
