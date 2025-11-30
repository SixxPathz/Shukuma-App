// Metadata mapping for all exercises
// Maps exercise names to difficulty, type, and duration
export const exerciseMetadata = {
  // Cardio Exercises
  "Burpees": { difficulty: "Hard", type: "Cardio", duration: "Medium", category: "cardio" },
  "Jumping Jacks": { difficulty: "Easy", type: "Cardio", duration: "Short", category: "cardio" },
  "Reverse Burpee": { difficulty: "Medium", type: "Cardio", duration: "Medium", category: "cardio" },
  "Tuck Jumps": { difficulty: "Hard", type: "Cardio", duration: "Short", category: "cardio" },
  
  // Core Exercises
  "Crab Toe Touchers": { difficulty: "Medium", type: "Core", duration: "Medium", category: "core" },
  "Plank To Push-Up": { difficulty: "Medium", type: "Core", duration: "Medium", category: "core" },
  "Sit-Ups": { difficulty: "Easy", type: "Core", duration: "Short", category: "core" },
  "V-Ups": { difficulty: "Hard", type: "Core", duration: "Medium", category: "core" },
  
  // Lower Body Exercises
  "Curtsy Lunge": { difficulty: "Medium", type: "Lower Body", duration: "Medium", category: "lower" },
  "Curtsy Lunge 2": { difficulty: "Medium", type: "Lower Body", duration: "Medium", category: "lower" },
  "Jumping Split Lunge": { difficulty: "Hard", type: "Lower Body", duration: "Medium", category: "lower" },
  "Prison Squat": { difficulty: "Medium", type: "Lower Body", duration: "Medium", category: "lower" },
  "Squat": { difficulty: "Easy", type: "Lower Body", duration: "Short", category: "lower" },
  
  // Upper Body Exercises
  "Decline Push-Up": { difficulty: "Hard", type: "Upper Body", duration: "Medium", category: "upper" },
  "Pike Push-Up": { difficulty: "Medium", type: "Upper Body", duration: "Medium", category: "upper" },
  "Push Up": { difficulty: "Easy", type: "Upper Body", duration: "Short", category: "upper" },
  "Push-Up To Toe Touch": { difficulty: "Hard", type: "Upper Body", duration: "Medium", category: "upper" },
};

// Default metadata for unknown exercises
export const defaultMetadata = {
  difficulty: "Medium",
  type: "Core",
  duration: "Medium",
  category: "core"
};

// Get metadata for an exercise
export const getExerciseMetadata = (exerciseName) => {
  return exerciseMetadata[exerciseName] || defaultMetadata;
};

// Filter options
export const filterOptions = {
  difficulty: ["All", "Easy", "Medium", "Hard"],
  type: ["All", "Cardio", "Core", "Lower Body", "Upper Body"],
  duration: ["All", "Short", "Medium", "Long"]
};
