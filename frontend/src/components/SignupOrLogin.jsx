import { useState } from "react";

export const SignupOrLogin = ({ mode }) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div>
      <label>
        <p>Email</p>
        <input type='email' name='email' />
      </label>
      <label>
        <p>Password</p>
        <input type={showPass ? "text" : "password"} name='username' />
        <div>
          <button onClick={() => setShowPass((prevState) => !prevState)}>
            showpass
          </button>
        </div>
      </label>

      <div>
        <button>{mode}</button>
      </div>
    </div>
  );
};
