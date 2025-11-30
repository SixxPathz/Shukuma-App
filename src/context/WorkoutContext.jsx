import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { auth } from '../firebase';
import { saveWorkout, updateUserProgress } from '../utils/storageUtils';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [flippedCards, setFlippedCards] = useState([]);
  const [totalCards, setTotalCards] = useState(0);

  const startTracking = (cardCount = 0) => {
    // Only initialize new tracking session if not already tracking
    if (!isTracking) {
      setIsTracking(true);
      setWorkoutStartTime(new Date());
      setFlippedCards([]);
      setTotalCards(cardCount || 0);
      console.log('Workout tracking started with', cardCount, 'total cards');
      return;
    }

    // If already tracking, but totalCards not set and cardCount provided, set it
    if (isTracking && (!totalCards || totalCards === 0) && cardCount > 0) {
      setTotalCards(cardCount);
      console.log('Workout total cards updated to', cardCount);
    }
  };

  const trackCardFlip = (card, totalCardsArg = 0) => {
    if (!isTracking) {
      startTracking(totalCardsArg);
    } else if ((!totalCards || totalCards === 0) && totalCardsArg > 0) {
      // Not tracking total count yet, but we have an argument
      setTotalCards(totalCardsArg);
    }

    // Check if this card was already flipped
    const alreadyFlipped = flippedCards.some(c => c.id === card.id);
    if (!alreadyFlipped && card.type === 'exercise') {
      setFlippedCards(prev => [...prev, {
        ...card,
        flippedAt: new Date()
      }]);
      console.log('Card flipped:', card.exerciseName || card.id);
    }
  };

  const saveCurrentWorkout = async (workoutType = 'manual') => {
    if (!user?.uid || flippedCards.length === 0) {
      alert('No exercises to save. Please flip at least one card.');
      return false;
    }

    try {
      const workoutEndTime = new Date();
      const duration = workoutStartTime 
        ? Math.floor((workoutEndTime - workoutStartTime) / 1000) 
        : flippedCards.length * 45;

      const workoutData = {
        exercises: flippedCards.map(card => ({
          cardId: card.id,
          name: card.exerciseName || card.id,
          category: card.category || 'Unknown',
          difficulty: card.difficulty || 'Medium',
          duration: card.duration || 45,
          flippedAt: card.flippedAt
        })),
        totalDuration: duration,
        completedExercises: flippedCards.length,
        totalExercises: totalCards || flippedCards.length,
        completedAt: workoutEndTime,
        type: workoutType
      };

      const token = await auth.currentUser?.getIdToken();
      await saveWorkout(user.uid, workoutData, token);
      
      await updateUserProgress(user.uid, { workoutsCompleted: 1, exercisesCompleted: flippedCards.length, duration }, token);

      console.log('Workout saved successfully');
      // Notify other UI parts (such as Profile) to refresh
      try { window.dispatchEvent(new Event('workoutSaved')); } catch (err) { /* noop */ }
      
      // Reset tracking
      setIsTracking(false);
      setFlippedCards([]);
      setWorkoutStartTime(null);
      setTotalCards(0);
      
      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  };

  const resetTracking = () => {
    setIsTracking(false);
    setFlippedCards([]);
    setWorkoutStartTime(null);
    setTotalCards(0);
  };

  const value = {
    isTracking,
    workoutStartTime,
    flippedCards,
    flippedCardsCount: flippedCards.length,
    totalCards,
    startTracking,
    trackCardFlip,
    saveCurrentWorkout,
    resetTracking
  };

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};
