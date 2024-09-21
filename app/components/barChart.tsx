import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Expense } from "../types/expense";
import { Category } from "../types/category";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const categoryColors: Record<string, string> = {
  Housing: "#ffc9c9", // red-100
  Bills: "#b2f2bb", // green-100
  Food: "#ffa94d", // orange-100
  Groceries: "#4dabf7", // blue-100
  Snacks: "#ffd8a8", // orange-50
  Entertainment: "#ced4da", // gray-200
  "Dining Out": "#ffec99", // yellow-100
  // Shopping: "#eff6ff", // blue-50
  Shopping: "#a5d8ff", // blue-50
};

type BarChartProps = {
  expenses: Expense[];
  categories: Category[];
};

export default function BarChart({ expenses, categories }: BarChartProps) {
  const labels = categories.map((category) => category.name);
  const data = labels.map((label) => {
    const total = expenses
      .filter((expense) => expense.category === label)
      .reduce((sum, expense) => sum + expense.amount / 100, 0); // Divide by 100 if amount is in cents
    return total;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Expenses by Category",
        data, // The data array corresponds to the labels
        backgroundColor: labels.map((label) => categoryColors[label]), // Use the color map here
        borderColor: labels.map((label) => categoryColors[label]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#000000",
        },
      },
      title: { display: true, text: "Expenses by Category" },
    },
  };

  return <Bar data={chartData} options={options} />;
}
