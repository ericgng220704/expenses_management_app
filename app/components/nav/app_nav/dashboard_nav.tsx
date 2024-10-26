import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardNav() {
  const userClerk = await currentUser();
  if (!userClerk) return <div>Not signed in</div>;

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-4">
          <a href="#" className="text-xl font-bold text-purple-600">
            <span className="font-semibold">clerk</span>
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <span>Hi, {userClerk.firstName}!</span>
          <UserButton></UserButton>
        </div>
      </div>
    </nav>
  );
}
