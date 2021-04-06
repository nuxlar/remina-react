import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function TodoPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return isAuthenticated && <h3>Todo Page</h3>;
}

export default TodoPage;
