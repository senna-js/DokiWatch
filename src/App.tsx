import { Navbar } from "./components/navbar";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold">Welcome to Doki Watch</h1>
        <p className="mt-2">Explore your favorite anime & manga here.</p>
      </div>
    </div>
  );
};

export default App;
