import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <SignIn
      appearance={{
        variables: {
          colorPrimary: "#0070f3", // Blue
          colorBackground: "#ffffff",
          colorInputBackground: "#f0f0f0",
        },
      }}
    />
  );
};

export default SignInPage;
