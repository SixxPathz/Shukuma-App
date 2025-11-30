// Dynamically load all exercise cards from the Shukuma Cards folder
const cardsBasePath = '/Shukuma Cards_Full Deck';

// Card categories and their paths
const cardCategories = {
  cardio: 'Cardio Exercise Cards',
  core: 'Core Exercise Cards',
  lower: 'Lower Body Exercise cards',
  upper: 'Upper Body Exercise Cards'
};

// All card files organized by category
const cardFiles = {
  cardio: [
    'Burpees 1.jpg', 'Burpees 2.jpg', 'Burpees 3.jpg', 'Burpees 4.jpg', 'Burpees 5.jpg',
    'Jumping Jacks 1.jpg', 'Jumping Jacks 2.jpg', 'Jumping Jacks 3.jpg', 'Jumping Jacks 4.jpg',
    'Reverse Burpee 1.jpg', 'Reverse Burpee 2.jpg',
    'Tuck Jumps 1.jpg', 'Tuck Jumps 2.jpg'
  ],
  core: [
    'Crab Toe Touchers 1.jpg', 'Crab Toe Touchers 2.jpg', 'Crab Toe Touchers 3.jpg', 'Crab Toe Touchers 4.jpg',
    'Plank To Push-Up 1.jpg', 'Plank To Push-Up 2.jpg',
    'Sit-Ups 1.jpg', 'Sit-Ups 2.jpg', 'Sit-Ups 3.jpg', 'Sit-Ups 4.jpg', 'Sit-Ups 5.jpg',
    'V-Ups 1.jpg', 'V-Ups 2.jpg'
  ],
  lower: [
    'Curtsy Lunge 1.jpg', 'Curtsy Lunge 2.jpg',
    'Jumping Split Lunge 1.jpg', 'Jumping Split Lunge 2.jpg',
    'Prison Squat 1.jpg', 'Prison Squat 2.jpg', 'Prison Squat 3.jpg', 'Prison Squat 4.jpg',
    'Squat 1.jpg', 'Squat 2.jpg', 'Squat 3.jpg', 'Squat 4.jpg', 'Squat 5.jpg'
  ],
  upper: [
    'Decline Push-Up 1.jpg', 'Decline Push-Up 2.jpg',
    'Pike Push-Up 1.jpg', 'Pike Push-Up 2.jpg', 'Pike Push-Up 3.jpg', 'Pike Push-Up 4.jpg',
    'Push Up 1.jpg', 'Push Up 2.jpg', 'Push Up 3.jpg', 'Push Up 4.jpg', 'Push Up 5.jpg',
    'Push-Up To Toe Touch 1.jpg', 'Push-Up To Toe Touch 2.jpg'
  ]
};

// Special cards
const specialCards = {
  disclaimer: 'Disclaimer Card.jpg',
  waterBreak1: 'Water Break Card.jpg',
  waterBreak2: 'Water Break Card 2.jpg',
  backOfCard: 'back of card image.jpg'
};

// Extract exercise name from filename
export const extractExerciseName = (filename) => {
  // Remove file extension
  let name = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  
  // Remove number suffix (e.g., "1", "2", etc.)
  name = name.replace(/\s+\d+$/, '');
  
  // Remove double extension (e.g., ".jpg.jpg")
  name = name.replace(/\.jpg$/, '');
  
  return name.trim();
};

// Check if card is a special card
export const isSpecialCard = (filename) => {
  const specialNames = Object.values(specialCards);
  return specialNames.includes(filename);
};

// Get card type from filename
export const getCardType = (filename) => {
  if (filename === specialCards.disclaimer) return 'disclaimer';
  if (filename === specialCards.waterBreak1 || filename === specialCards.waterBreak2) return 'waterbreak';
  if (filename === specialCards.backOfCard) return 'back';
  return 'exercise';
};

// Load all cards
export const loadAllCards = () => {
  const allCards = [];
  
  // Load exercise cards by category
  Object.entries(cardFiles).forEach(([category, files]) => {
    files.forEach(filename => {
      const exerciseName = extractExerciseName(filename);
      const imagePath = `${cardsBasePath}/${cardCategories[category]}/${filename}`;
      const webpBase = imagePath.replace(/\.(jpg|jpeg|png)$/i, '');
      const webpSrcSet = `${webpBase}-sm.webp 320w, ${webpBase}-md.webp 640w, ${webpBase}-lg.webp 1080w`;
      const webpSm = `${webpBase}-sm.webp`;
      
      allCards.push({
        id: `${category}-${filename}`,
        exerciseName,
        category,
        imagePath,
        webpSrcSet,
        webpSm,
        webpLg: `${webpBase}-lg.webp`,
        filename,
        type: 'exercise'
      });
    });
  });
  
  // Add special cards (they can appear in random shuffle)
  Object.entries(specialCards).forEach(([key, filename]) => {
    if (key !== 'backOfCard') {
      const imagePath = `${cardsBasePath}/${filename}`;
      const webpBase = imagePath.replace(/\.(jpg|jpeg|png)$/i, '');
      const webpSrcSet = `${webpBase}-sm.webp 320w, ${webpBase}-md.webp 640w, ${webpBase}-lg.webp 1080w`;

      allCards.push({
        id: `special-${key}`,
        exerciseName: key === 'disclaimer' ? 'Disclaimer' : 'Water Break',
        category: 'special',
        imagePath,
        webpSrcSet,
        webpLg: `${webpBase}-lg.webp`,
        filename,
        type: getCardType(filename)
      });
    }
  });
  
  return allCards;
};

// Get only exercise cards (exclude disclaimer and water break for filtering)
export const getExerciseCards = () => {
  return loadAllCards().filter(card => card.type === 'exercise');
};

// Get random workout cards (always includes water break cards, excludes disclaimer)
export const getRandomWorkout = (count = 10) => {
  const allCards = loadAllCards();
  
  // Separate exercise cards and water break cards
  const exerciseCards = allCards.filter(card => card.type === 'exercise');
  const waterBreakCards = allCards.filter(card => card.type === 'waterbreak');
  
  // Shuffle exercise cards
  const shuffledExercises = [...exerciseCards].sort(() => Math.random() - 0.5);
  
  // Take the requested number of exercise cards
  const selectedCards = shuffledExercises.slice(0, count);
  
  // Insert water break cards at strategic intervals (every 4-5 exercises)
  const cardsWithBreaks = [];
  selectedCards.forEach((card, index) => {
    cardsWithBreaks.push(card);
    // Add water break after every 4-5 exercises (randomly)
    if ((index + 1) % 5 === 0 && index < selectedCards.length - 1) {
      const randomWaterBreak = waterBreakCards[Math.floor(Math.random() * waterBreakCards.length)];
      if (randomWaterBreak) {
        cardsWithBreaks.push(randomWaterBreak);
      }
    }
  });
  
  return cardsWithBreaks;
};

// Get grouped cards by exercise name
export const getGroupedCards = () => {
  const allCards = loadAllCards();
  const grouped = {};
  
  allCards.forEach(card => {
    if (!grouped[card.exerciseName]) {
      grouped[card.exerciseName] = [];
    }
    grouped[card.exerciseName].push(card);
  });
  
  return grouped;
};

// Get unique exercises (one card per exercise)
export const getUniqueExercises = () => {
  const grouped = getGroupedCards();
  return Object.entries(grouped).map(([exerciseName, cards]) => ({
    ...cards[0],
    variations: cards.length
  }));
};
