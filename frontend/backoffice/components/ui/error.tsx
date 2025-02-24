import { AxiosError } from "axios";

export function Error({ error }: { error: AxiosError }) {
  if ("satus" in error && error.status === 403) {
    return (
      <div className="w-full h-full place-items-center grid">
        <p>You are not authorized to see the users</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full place-items-center grid">
      <p>An error occured</p>
    </div>
  );
}
