const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

export default async function getJwtToken() {
  // console.log("Getting JWT token");
  const creds = JSON.stringify({
    username: "admin",
    password: "Admin1!",
  });
  const response = await fetch(apiBaseUrl + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: creds,
  });
  // console.log("Response", response);
  if (!response.ok) {
    console.error("response", response);
    throw new Error("Login failed");
  }
  const data = await response.json();
  // console.log("Token", data);
  return data.access_token;
}
