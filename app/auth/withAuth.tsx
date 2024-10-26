import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

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

export function withAuthApi(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { userId } = auth();

    if (!userId) {
      return new Response("User is not signed in.", { status: 401 });
    }

    return handler(req);
  };
}
