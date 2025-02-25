"use client";
import token from "@/lib/token";
import { jwtConstants } from "@/utils/jwt";
import { postLogin } from "@/lib/repositories/users/usersRepositories";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [signIndata, onChangeSignInData] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await postLogin(signIndata);
      token.setToken(jwtConstants.key, res.data.access_token);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={onLogin} className="space-y-6">
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          type="text"
          placeholder="Username"
          name="username"
          value={signIndata.username}
          onChange={(e) =>
            onChangeSignInData((values) => ({
              ...values,
              [e.target.name]: e.target.value,
            }))
          }
        />
      </fieldset>
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          type="password"
          placeholder="Password"
          autoComplete="off"
          name="password"
          value={signIndata.password}
          onChange={(e) =>
            onChangeSignInData((values) => ({
              ...values,
              [e.target.name]: e.target.value,
            }))
          }
        />
      </fieldset>
      <button
        type="submit"
        className="btn btn-lg btn-primary pull-xs-right w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Log in
      </button>
    </form>
  );
}
