import { Navbar } from "./components/navbar";
import { AnimeStack } from "./components/AnimeStack";

const App = () => {
  if (localStorage.getItem("user")) {
    console.log(JSON.parse(localStorage.getItem("user") as string));
  }
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold">Welcome to Doki Watch</h1>
        <p className="mt-2">Explore your favorite anime & manga here.</p>
      </div>
      <div className="mt-16 ml-24">
        <AnimeStack type="Airing" />
        <AnimeStack type="Watching" />
      </div>
    </div>
  );
};

export default App;
