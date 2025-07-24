"use client";

import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setStatus("Reset email sent. Check your inbox.");
    } catch (err: any) {
      setStatus(err.errors?.[0]?.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Reset Link</button>
      <p>{status}</p>
    </form>
  );
}
