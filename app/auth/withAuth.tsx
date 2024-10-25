import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export function withAuth(WrappedComponent: React.ComponentType) {
  return async function AuthenticatedComponent() {
    // Retrieve the current user on the server
    const user = await currentUser();

    // If no user is signed in, redirect to the homepage or another route
    if (!user) {
      redirect("/"); // Redirect to the home page if unauthenticated
    }

    // If user is authenticated, render the wrapped component
    return <WrappedComponent />;
  };
}
