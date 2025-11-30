import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { getRandomWorkout } from '../utils/loadCards';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';

const RandomWorkout = () => {
  const { user } = useAuth();
  const { flippedCardsCount, totalCards, saveCurrentWorkout, resetTracking, startTracking } = useWorkout();
  const [workoutCards, setWorkoutCards] = useState([]);
  const [workoutCount, setWorkoutCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateWorkout = () => {
    startWorkout();
  };

  const startWorkout = () => {
    setIsGenerating(true);
    resetTracking(); // Reset previous workout tracking
    setTimeout(() => {
      const randomCards = getRandomWorkout(workoutCount);
      setWorkoutCards(randomCards);
      // Start tracking with total card count
      const exerciseCount = randomCards.filter(c => c.type === 'exercise').length;
      startTracking(exerciseCount);
      setIsGenerating(false);
    }, 300);
  };

  const regenerateWorkout = () => {
    generateWorkout();
  };

  const saveWorkout = async () => {
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      const success = await saveCurrentWorkout('random');
      if (success) {
        alert('✅ Workout saved successfully!');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('❌ Failed to save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Disclaimer now handled at app level */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header and Controls */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Random Workout Generator</h1>
          <p className="text-gray-600 mb-6">
            Generate a randomized workout routine. Set the number of exercises and hit generate!
          </p>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Workout Count Selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Exercises
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={workoutCount}
                  onChange={(e) => setWorkoutCount(Math.max(1, Math.min(30, parseInt(e.target.value) || 10)))}
                  className="w-full px-4 py-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateWorkout}
                disabled={isGenerating}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isGenerating ? 'Generating...' : workoutCards.length > 0 ? 'Regenerate Workout' : 'Generate Workout'}
              </button>
            </div>
          </div>
        </div>

        {/* Workout Cards Display */}
        {workoutCards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎲</div>
            <h2 className="text-2xl font-semibold text-black mb-2">Ready to Work Out?</h2>
            <p className="text-gray-600">Click "Generate Workout" to create your random exercise routine!</p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-black">
                Your Workout • {flippedCardsCount}/{totalCards} flipped
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={saveWorkout}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Workout'}
                </button>
                <button
                  onClick={regenerateWorkout}
                  className="px-4 py-2 text-sm font-medium text-black hover:text-white hover:bg-black rounded-lg transition-colors border-2 border-black"
                >
                  🔄 Shuffle Again
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workoutCards.map((card, index) => (
                <motion.div
                  key={`${card.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="aspect-[3/4] relative"
                >
                  {/* Exercise Number Badge */}
                  <div className="absolute top-2 left-2 z-10 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <Card
                    card={card}
                    onFlipToExercise={() => {
                      const exerciseCount = workoutCards.filter(c => c.type === 'exercise').length;
                      startTracking(exerciseCount);
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Workout Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Workout Tips</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Perform each exercise for 30-45 seconds</li>
                <li>• Take 15-30 second breaks between exercises</li>
                <li>• Stay hydrated throughout your workout</li>
                <li>• Listen to your body and modify as needed</li>
                <li>• Complete 2-3 rounds for a full workout</li>
              </ul>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default RandomWorkout;
