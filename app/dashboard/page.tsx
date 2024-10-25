import { withAuth } from "../auth/withAuth";
import App from "../components/app/app";
import DashboardNav from "../components/nav/app_nav/dashboard_nav";

function Dashboard() {
  return (
    <main>
      <DashboardNav />
      <App />
    </main>
  );
}

export default withAuth(Dashboard);
