// Client-side localStorage utilities for Shukuma App
// Replaces earlier server-backed database code (MongoDB). This keeps the same API signatures
// used in the app and stores data purely in browser localStorage.

const STORAGE_PREFIX = 'shukuma:';

const read = (key, fallback) => {
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch (e) { return fallback; }
};

const write = (key, value) => {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
};

// ============= USER OPERATIONS =============

export const createUserDocument = async (user) => {
  if (!user) return;
  const users = read('users', {});
  users[user.uid] = { ...users[user.uid], ...user, createdAt: users[user.uid]?.createdAt || new Date(), lastLogin: new Date() };
  write('users', users);
  return { success: true };
};

export const updateUserLastLogin = async (userId) => {
  const users = read('users', {});
  if (!users[userId]) return;
  users[userId].lastLogin = new Date();
  write('users', users);
};

export const getUserData = async (userId) => {
  if (!userId) return null;
  const users = read('users', {});
  return users[userId] || null;
};

// ============= WORKOUT OPERATIONS =============

export const saveWorkout = async (userId, workoutData) => {
  if (!userId) return null;
  const workouts = read('workouts', {});
  const id = `local_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  workouts[id] = { ...workoutData, id, userId };
  const byUser = read(`workouts_by_${userId}`, []);
  byUser.unshift(workouts[id]);
  write('workouts', workouts);
  write(`workouts_by_${userId}`, byUser);
  return id;
};

export const getUserWorkouts = async (userId, limitCount = 10) => {
  if (!userId) return [];
  const byUser = read(`workouts_by_${userId}`, []);
  return byUser.slice(0, limitCount);
};

export const getWorkoutById = async (workoutId) => {
  const workouts = read('workouts', {});
  return workouts[workoutId] || null;
};

// ============= PROGRESS OPERATIONS =============

export const updateUserProgress = async (userId, progressData) => {
  if (!userId) return;
  const progress = read('progress', {});
  const existing = progress[userId] || { totalWorkouts: 0, totalExercises: 0, totalDuration: 0, weeklyStreak: 0, monthlyGoal: 20, monthlyProgress: 0 };
  existing.totalWorkouts = (existing.totalWorkouts || 0) + (progressData.workoutsCompleted || 0);
  existing.totalExercises = (existing.totalExercises || 0) + (progressData.exercisesCompleted || 0);
  existing.totalDuration = (existing.totalDuration || 0) + (progressData.duration || 0);
  existing.lastWorkoutDate = new Date();
  existing.updatedAt = new Date();
  progress[userId] = existing;
  write('progress', progress);
};

export const getUserProgress = async (userId) => {
  if (!userId) return null;
  const progress = read('progress', {});
  return progress[userId] || { totalWorkouts:0, totalExercises:0, totalDuration:0, weeklyStreak:0, monthlyGoal:20, monthlyProgress:0 };
};

// ============= STATS OPERATIONS =============

export const getUserStats = async (userId) => {
  if (!userId) return null;
  const workouts = await getUserWorkouts(userId, 100);
  const progress = await getUserProgress(userId);
  const categoriesCompleted = { Cardio: 0, Core: 0, 'Lower Body': 0, 'Upper Body': 0 };
  workouts.forEach(w => {
    (w.exercises || []).forEach(e => { if (e.category && categoriesCompleted.hasOwnProperty(e.category)) categoriesCompleted[e.category]++; });
  });
  const stats = {
    totalWorkouts: progress.totalWorkouts || 0,
    totalExercises: progress.totalExercises || 0,
    totalDuration: progress.totalDuration || 0,
    categoriesCompleted,
    weeklyStreak: progress.weeklyStreak || 0,
    monthlyGoal: progress.monthlyGoal || 20,
    monthlyProgress: progress.monthlyProgress || 0,
    recentWorkouts: workouts.slice(0, 5)
  };
  return stats;
};

// ============= SETTINGS OPERATIONS =============

export const getUserSettings = async (userId) => {
  if (!userId) return null;
  const settings = read(`settings_${userId}`, null);
  return settings || { defaultDifficulty: 'All', defaultDuration: 'All', autoWaterBreaks: true, notificationsEnabled: true };
};

export const updateUserSettings = async (userId, settings) => {
  if (!userId) return;
  const current = read(`settings_${userId}`, {});
  const merged = { ...current, ...settings };
  write(`settings_${userId}`, merged);
};
