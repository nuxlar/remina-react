import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      {isAuthenticated ? (
        <>
          <h2>Dashboard Page</h2>
          <h3>{user.name}</h3>
        </>
      ) : (
        <>
          {" "}
          <h2>Home Page</h2>
          <h3>About</h3>
        </>
      )}
    </div>
  );
}
export default Dashboard;
