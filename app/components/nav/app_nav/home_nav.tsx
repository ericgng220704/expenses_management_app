import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

export default async function HomeNav() {
  const user = await currentUser();

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Left side: Brand and Links */}
        <div className="flex items-center space-x-4">
          {/* Brand Logo */}
          <a href="/" className="text-xl font-bold text-purple-600">
            <span className="font-semibold">clerk</span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <a href="#" className="text-gray-700 hover:text-black">
              Product
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              Docs
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              Changelog
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-black">
              Company
            </a>
          </div>
        </div>

        {/* Right side: Sign out and Dashboard */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Sign Out Button */}
              <SignOutButton>
                <button className="text-gray-700 hover:text-black">
                  Sign out
                </button>
              </SignOutButton>

              {/* Dashboard Button */}
              <a
                href="/dashboard"
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Dashboard
              </a>
            </>
          ) : (
            <SignInButton>
              <button className="text-gray-700 hover:text-black">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
