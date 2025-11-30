import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateInstructions } from '../utils/instructionGenerator';
import { getExerciseMetadata } from '../data/metadata';
import { useWorkout } from '../context/WorkoutContext';

const Card = ({ card, onClick, onFlipToExercise }) => {
  const [flipState, setFlipState] = useState(0); // 0: back logo, 1: exercise image, 2: instructions
  const { trackCardFlip } = useWorkout();
  const instructions = generateInstructions(card.exerciseName, card.type);
  const metadata = getExerciseMetadata(card.exerciseName);
  const backImagePath = '/Shukuma Cards_Full Deck/back of card image.jpg';

  // Reset flip state when card changes
  useEffect(() => {
    setFlipState(0);
  }, [card.id]);

  const handleClick = () => {
    const nextState = (flipState + 1) % 3;
    setFlipState(nextState);
    
    // Track the flip when user flips to see the exercise (state 1)
    if (nextState === 1 && card.type === 'exercise') {
      // Let parent know we're about to start flipping; parent may call startTracking(totalCards)
      if (onFlipToExercise) {
        try { onFlipToExercise(card); } catch (e) { /* ignore */ }
      }
      trackCardFlip({
        id: card.id,
        exerciseName: card.exerciseName,
        category: metadata?.type || card.category || 'Unknown',
        difficulty: metadata?.difficulty || 'Medium',
        duration: metadata?.duration || 45,
        type: card.type
      });
    }
    
    if (onClick) onClick(card);
  };

  return (
    <div className="perspective-container w-full h-full">
      <div
        className="relative w-full h-full cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden"
        onClick={handleClick}
      >
        <motion.div
          key={flipState}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {flipState === 0 && (
            /* Card Back - Logo */
            <div className="w-full h-full flex items-center justify-center bg-black p-8">
              <img
                src={backImagePath}
                alt="Card Back"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {flipState === 1 && (
            /* Exercise Image */
            <div className="w-full h-full relative">
              <picture>
                {card.webpSrcSet && (
                  <source
                    type="image/webp"
                    srcSet={card.webpSrcSet}
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 640px, 1080px"
                  />
                )}
                <img
                  src={card.webpSm || card.webpLg || card.imagePath}
                  srcSet={card.webpSrcSet}
                  alt={card.exerciseName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-semibold text-lg">{card.exerciseName}</h3>
              </div>
            </div>
          )}

          {flipState === 2 && (
            /* Instructions */
            <div className="w-full h-full bg-white p-6 overflow-auto">
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{card.exerciseName}</h2>
                
                {/* Metadata badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white border-2 border-black">
                    {metadata.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-black border-2 border-black">
                    {metadata.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white border-2 border-black">
                    {metadata.duration}
                  </span>
                </div>

                {/* Instructions */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-3">Instructions:</h3>
                  <ol className="space-y-2">
                    {instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-sm flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tap to reset indicator */}
                <div className="mt-4 text-center text-sm text-gray-500">
                  Tap to reset card
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Card;
