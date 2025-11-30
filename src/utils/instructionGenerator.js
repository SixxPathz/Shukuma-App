// Auto-generate simple, neutral instructions for exercises
export const generateInstructions = (exerciseName, cardType = 'exercise') => {
  // Handle special cards
  if (cardType === 'waterbreak') {
    return [
      "Take a 30–60 second water break.",
      "Stay hydrated!",
      "Catch your breath and prepare for the next exercise."
    ];
  }
  
  if (cardType === 'disclaimer') {
    return [
      "Please exercise responsibly and consult a professional if needed.",
      "Listen to your body and take breaks when necessary.",
      "Ensure you have proper space and equipment before starting."
    ];
  }
  
  // Generate generic instructions based on exercise name
  const lowerName = exerciseName.toLowerCase();
  
  // Default generic instructions
  const defaultInstructions = [
    "Stand in your starting position",
    "Perform the movement shown in the image",
    "Maintain controlled motion",
    "Repeat for 30 to 45 seconds"
  ];
  
  // Customize based on exercise type keywords
  if (lowerName.includes('push-up') || lowerName.includes('pushup') || lowerName.includes('push up')) {
    return [
      "Start in a plank position with hands shoulder-width apart",
      "Lower your body until chest nearly touches the floor",
      "Push back up to starting position",
      "Keep your core engaged throughout",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('squat')) {
    return [
      "Stand with feet shoulder-width apart",
      "Lower your body by bending your knees",
      "Keep your chest up and back straight",
      "Return to starting position",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('lunge')) {
    return [
      "Stand with feet hip-width apart",
      "Step forward or backward as shown in the image",
      "Lower your body until both knees are bent at 90 degrees",
      "Return to starting position",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('plank')) {
    return [
      "Get into plank position with forearms on the ground",
      "Keep your body in a straight line",
      "Engage your core muscles",
      "Hold the position or perform the movement shown",
      "Maintain for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('sit-up') || lowerName.includes('situp') || lowerName.includes('sit up')) {
    return [
      "Lie on your back with knees bent",
      "Place hands behind your head or across chest",
      "Engage your core and lift your upper body",
      "Lower back down with control",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('v-up')) {
    return [
      "Lie flat on your back with arms extended overhead",
      "Simultaneously lift your legs and upper body",
      "Reach your hands toward your toes forming a 'V'",
      "Lower back down with control",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('burpee')) {
    return [
      "Start in a standing position",
      "Drop into a squat and place hands on the ground",
      "Jump feet back into a plank position",
      "Jump feet back to squat position and stand up",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('jumping jack')) {
    return [
      "Start with feet together and arms at your sides",
      "Jump while spreading your legs and raising arms overhead",
      "Jump back to starting position",
      "Maintain a steady rhythm",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('jump')) {
    return [
      "Stand in your starting position",
      "Perform the jumping movement shown in the image",
      "Land softly on the balls of your feet",
      "Maintain control throughout",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('crab')) {
    return [
      "Sit on the ground with hands behind you",
      "Lift your hips off the ground into a crab position",
      "Perform the movement shown in the image",
      "Keep your core engaged",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('pike')) {
    return [
      "Start in a downward dog or pike position",
      "Keep your hips elevated",
      "Perform the movement shown in the image",
      "Maintain control throughout",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  if (lowerName.includes('toe touch')) {
    return [
      "Start in your starting position",
      "Reach toward your toes as shown in the image",
      "Maintain controlled motion",
      "Keep your core engaged",
      "Repeat for 30 to 45 seconds"
    ];
  }
  
  // Return default instructions if no specific pattern matches
  return defaultInstructions;
};
