import { useState } from "react";
import { SignupOrLogin } from "./SignupOrLogin";

export const Auth = () => {
  const [mode, setMode] = useState("Signup");

  return (
    <div>
      {mode === "Signup" ? (
        <div>
          <h2>Welcome to Mindkeep!</h2>
          <p>Sign up and start taking notes</p>
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <p>to continue to your Mindkeep account</p>
        </div>
      )}

      <SignupOrLogin mode={mode} />

      {mode === "Signup" ? (
        <div>
          <p>Already have an account?</p>
          <button onClick={() => setMode("Login")}>Log in</button>
        </div>
      ) : (
        <div>
          <p>Create a new account?</p>
          <button onClick={() => setMode("Signup")}>Sign Up</button>
        </div>
      )}
    </div>
  );
};
