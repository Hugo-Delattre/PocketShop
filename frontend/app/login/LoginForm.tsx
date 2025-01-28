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

  const onLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postLogin(signIndata)
      .then((res) => {
        token.setToken(jwtConstants.key, res.data.access_token);
        router.push("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <form onSubmit={onLogin}>
      <fieldset className="form-group">
        <input
          className="form-control form-control-lg"
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
          className="form-control form-control-lg"
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
      <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
        Log in
      </button>
    </form>
  );
}
