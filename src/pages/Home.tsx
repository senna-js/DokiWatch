import { AnimeWatchingStack } from "../components/AnimeStacks/AnimeWatchingStack";
import { AnimeAiringStack } from "../components/AnimeStacks/AnimeAiringStack";
import { TopAiringAnimeStack } from "../components/AnimeStacks/topAiringStack";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

const Home = () => {
  const { isSignedIn } = useUser();
  return (
    <div className="md:mx-[150px]">
      <motion.div
        className="p-2 sm:p-4 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="font-bold font-hpSimplifiedbold caret-transparent ml-5 sm:ml-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: "clamp(1.5rem, 4vw + 1rem, 4.375rem)" }}
        >
          Welcome to Doki Watch
        </motion.h1>
        {/* <motion.p
            className="mt-2 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Explore your favorite anime & manga here.
          </motion.p> */}
      </motion.div>
      <motion.div
        className="mt-8 sm:mt-10 m-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <TopAiringAnimeStack />
      </motion.div>
      {isSignedIn && (
        <motion.div
          className="m-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AnimeAiringStack />
          <AnimeWatchingStack />
        </motion.div>
      )}
    </div>
  );
};

export default Home;
