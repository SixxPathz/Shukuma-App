import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import tapIcon from '../assets/tap.gif';
import flipIcon from '../assets/flip.png';
import exerciseIcon from '../assets/exercise.png';
import exercisesFeatureIcon from '../assets/Browse.png';
import randomFeatureIcon from '../assets/Random workout.png';
import { loadAllCards } from '../utils/loadCards';
import { getExerciseMetadata } from '../data/metadata';
import { useMemo } from 'react';

const Home = () => {
  const allCards = useMemo(() => loadAllCards(), []);
  const exerciseCards = useMemo(() => allCards.filter(c => c.type === 'exercise'), [allCards]);
  const exerciseCount = exerciseCards.length;
  const categoryCount = useMemo(() => new Set(exerciseCards.map(c => c.category)).size, [exerciseCards]);
  const difficultyCount = useMemo(() => new Set(exerciseCards.map(c => getExerciseMetadata(c.exerciseName).difficulty)).size, [exerciseCards]);
  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Welcome to Shukuma
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your digital exercise companion. Transform your workout routine with our interactive exercise cards.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-full"
          >
            <Link
              to="/exercises"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-black h-full flex flex-col justify-between"
            >
              <div className="mb-4 flex items-center justify-center">
                <img src={exercisesFeatureIcon} alt="Browse Exercises" className="w-14 h-14 object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2 text-center">Browse Exercises</h2>
              <p className="text-gray-600">
                Explore our full collection of exercise cards. Filter by difficulty, type, and duration to find the perfect workout.
              </p>
            </Link>
          </motion.div>

            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-full"
          >
            <Link
              to="/random"
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-black h-full flex flex-col justify-between"
            >
              <div className="mb-4 flex items-center justify-center">
                <img src={randomFeatureIcon} alt="Random Workout" className="w-14 h-14 object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2 text-center">Random Workout</h2>
              <p className="text-gray-600">
                Generate a random daily workout routine. Get a fresh, randomized set of exercises every time.
              </p>
            </Link>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 border-2 border-black"
        >
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            Exercise Collection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-black mb-2">{exerciseCount}</div>
              <div className="text-sm text-gray-600">Exercise Cards</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-black mb-2">{categoryCount}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-black mb-2">{difficultyCount}</div>
              <div className="text-sm text-gray-600">Difficulty Levels</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-black mb-2">∞</div>
              <div className="text-sm text-gray-600">Combinations</div>
            </div>
          </div>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-bold text-black mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-black">
              <div className="mb-3 flex justify-center">
                <img src={tapIcon} alt="Tap" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="font-semibold text-black mb-2">1. Tap a Card</h3>
              <p className="text-sm text-gray-600">Select any exercise card to view it</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-black">
              <div className="mb-3 flex justify-center">
                <img src={flipIcon} alt="Flip" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="font-semibold text-black mb-2">2. Flip to Learn</h3>
              <p className="text-sm text-gray-600">Tap again to see detailed instructions</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md border-2 border-black">
              <div className="mb-3 flex justify-center">
                <img src={exerciseIcon} alt="Exercise" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="font-semibold text-black mb-2">3. Start Exercising</h3>
              <p className="text-sm text-gray-600">Follow the instructions and get fit!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
