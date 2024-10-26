import { withAuth } from "../auth/withAuth";
import App from "../components/app/app";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../lib/prisma";

import InitialBalanceSetUp from "../components/initial/balance";

async function Dashboard() {
  const userClerk = await currentUser();
  if (!userClerk) return <div>Not signed in</div>;

  const user = await prisma.user.findFirst({
    where: {
      id: userClerk.id,
    },
  });

  if (!user) {
    return <div>Something Wrong</div>;
  }

  const using_balance_id = user.using_balance_id;

  if (using_balance_id) {
    return <App user={user} />;
  } else {
    return <InitialBalanceSetUp />;
  }
}

export default withAuth(Dashboard);
