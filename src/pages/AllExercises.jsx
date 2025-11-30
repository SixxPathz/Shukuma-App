import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import FilterBar from '../components/FilterBar';
import { loadAllCards } from '../utils/loadCards';
import { getExerciseMetadata } from '../data/metadata';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';

const AllExercises = () => {
  const { user } = useAuth();
  const { flippedCardsCount, saveCurrentWorkout, resetTracking, startTracking } = useWorkout();
  const [filters, setFilters] = useState({
    difficulty: 'All',
    type: 'All',
    duration: 'All'
  });
  const [isSaving, setIsSaving] = useState(false);

  const allCards = useMemo(() => loadAllCards(), []);
  const allExercises = useMemo(() => allCards.filter(c => c.type === 'exercise'), [allCards]);

  const filteredExercises = useMemo(() => {
    // Filter exercise cards
    const filtered = allExercises.filter(card => {
      const metadata = getExerciseMetadata(card.exerciseName);

      if (filters.difficulty !== 'All' && metadata.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.type !== 'All' && metadata.type !== filters.type) {
        return false;
      }
      if (filters.duration !== 'All' && metadata.duration !== filters.duration) {
        return false;
      }

      return true;
    });

    // Randomize the filtered results
    const randomized = [...filtered].sort(() => Math.random() - 0.5);
    
    // Add water break cards at intervals (every 5 exercises)
    const waterBreakCards = allCards.filter(c => c.type === 'waterbreak');
    const withWaterBreaks = [];
    
    randomized.forEach((card, index) => {
      withWaterBreaks.push(card);
      // Add water break after every 5 exercises
      if ((index + 1) % 5 === 0 && index < randomized.length - 1 && waterBreakCards.length > 0) {
        const randomWaterBreak = waterBreakCards[Math.floor(Math.random() * waterBreakCards.length)];
        withWaterBreaks.push(randomWaterBreak);
      }
    });

    return { cards: withWaterBreaks, exerciseCount: filtered.length };
  }, [allExercises, allCards, filters]);

  const saveSelectedWorkout = async () => {
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      const success = await saveCurrentWorkout('manual');
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

  const clearSelection = () => {
    resetTracking();
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      <FilterBar filters={filters} onFilterChange={setFilters} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">All Exercises</h1>
              <p className="text-gray-600">
                Showing {filteredExercises.exerciseCount} exercises {filteredExercises.cards.length > filteredExercises.exerciseCount && `(+ ${filteredExercises.cards.length - filteredExercises.exerciseCount} water breaks)`}
              </p>
            </div>
            
            {flippedCardsCount > 0 && (
              <div className="flex gap-3">
                <div className="px-4 py-2 bg-black text-white rounded-lg font-medium">
                  {flippedCardsCount} flipped
                </div>
                <button
                  onClick={clearSelection}
                  className="px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Clear
                </button>
                <button
                  onClick={saveSelectedWorkout}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Workout'}
                </button>
              </div>
            )}
          </div>
          
          {flippedCardsCount === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              💡 Flip exercise cards to track them in your workout
            </p>
          )}
        </div>

        {filteredExercises.cards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No exercises match your filters.</p>
            <button
              onClick={() => setFilters({ difficulty: 'All', type: 'All', duration: 'All' })}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.cards.map((card, index) => {
              return (
                <motion.div
                  key={`${card.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="aspect-[3/4] relative"
                >
                  <Card
                    card={card}
                    onFlipToExercise={() => {
                      // start tracking with the number of exercise cards present in this filtered view
                      startTracking(filteredExercises.exerciseCount);
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllExercises;
