export default function InitialBalanceSetUp() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Expense Manager!
        </h1>
        <p className="text-gray-600 mb-6">
          Let's start by setting up your first balance.
        </p>

        <div className="w-full mb-4">
          <label
            htmlFor="balance"
            className="block text-left text-gray-700 font-semibold mb-2"
          >
            Enter Initial Balance
          </label>
          <input
            type="number"
            id="balance"
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          Create Balance
        </button>
      </div>
    </div>
  );
}
