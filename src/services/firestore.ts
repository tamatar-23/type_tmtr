
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TestResult } from '@/types/typing';

export interface UserStats {
    totalTests: number;
    bestWPM: number;
    averageWPM: number;
    averageAccuracy: number;
    totalTime: number;
    lastTestDate?: Date;
}

export interface FirestoreTestResult extends Omit<TestResult, 'id' | 'timestamp'> {
    userId: string;
    createdAt: any; // Firestore timestamp
}

export const firestoreService = {
    // Create or update user profile
    async createUserProfile(userId: string, userData: {
        displayName?: string;
        email?: string;
        photoURL?: string;
    }) {
        try {
            console.log('Creating user profile for:', userId);
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                const profileData = {
                    ...userData,
                    createdAt: serverTimestamp(),
                    totalTests: 0,
                    bestWPM: 0,
                    averageWPM: 0,
                    averageAccuracy: 0,
                    totalTime: 0
                };

                console.log('Creating new user document with data:', profileData);
                await setDoc(userRef, profileData);
                console.log('User profile created successfully');
            } else {
                console.log('User profile already exists');
            }
        } catch (error: any) {
            console.error('Error creating user profile:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            throw error;
        }
    },

    // Save test result
    async saveTestResult(userId: string, result: TestResult) {
        try {
            console.log('Saving test result for user:', userId);

            // Save the test result with simpler structure
            const testData = {
                userId,
                wpm: result.wpm,
                accuracy: result.accuracy,
                correct: result.correct,
                incorrect: result.incorrect,
                missed: result.missed,
                totalTime: result.totalTime,
                charCount: result.charCount,
                settings: result.settings,
                wpmHistory: result.wpmHistory,
                createdAt: serverTimestamp()
            };

            console.log('Test data to save:', testData);
            const testRef = await addDoc(collection(db, 'testResults'), testData);
            console.log('Test result saved with ID:', testRef.id);

            // Update user stats
            await this.updateUserStats(userId, result);

            return testRef.id;
        } catch (error: any) {
            console.error('Error saving test result:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            throw error;
        }
    },

    // Update user statistics
    async updateUserStats(userId: string, newResult: TestResult) {
        try {
            console.log('Updating user stats for:', userId);
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const currentStats = userSnap.data() as UserStats;
                console.log('Current user stats:', currentStats);

                const totalTests = (currentStats.totalTests || 0) + 1;
                const totalTime = (currentStats.totalTime || 0) + newResult.totalTime;
                const bestWPM = Math.max(currentStats.bestWPM || 0, newResult.wpm);

                // Calculate new average WPM
                const averageWPM = Math.round(
                    ((currentStats.averageWPM || 0) * (totalTests - 1) + newResult.wpm) / totalTests
                );

                // Calculate new average accuracy
                const averageAccuracy = Math.round(
                    ((currentStats.averageAccuracy || 0) * (totalTests - 1) + newResult.accuracy) / totalTests
                );

                const updatedStats = {
                    totalTests,
                    bestWPM,
                    averageWPM,
                    averageAccuracy,
                    totalTime,
                    lastTestDate: serverTimestamp()
                };

                console.log('Updating with stats:', updatedStats);
                await updateDoc(userRef, updatedStats);
                console.log('User stats updated successfully');
            } else {
                console.error('User document does not exist when trying to update stats');
                throw new Error('User document does not exist');
            }
        } catch (error: any) {
            console.error('Error updating user stats:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            throw error;
        }
    },

    // Get user statistics
    async getUserStats(userId: string): Promise<UserStats | null> {
        try {
            console.log('Fetching user stats for:', userId);
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                console.log('Raw user data from Firestore:', data);

                const stats = {
                    totalTests: data.totalTests || 0,
                    bestWPM: data.bestWPM || 0,
                    averageWPM: data.averageWPM || 0,
                    averageAccuracy: data.averageAccuracy || 0,
                    totalTime: data.totalTime || 0,
                    lastTestDate: data.lastTestDate?.toDate()
                };

                console.log('Processed user stats:', stats);
                return stats;
            } else {
                console.log('No user document found, creating one...');
                // Create a default user document if it doesn't exist
                await this.createUserProfile(userId, {});
                return {
                    totalTests: 0,
                    bestWPM: 0,
                    averageWPM: 0,
                    averageAccuracy: 0,
                    totalTime: 0
                };
            }
        } catch (error: any) {
            console.error('Error fetching user stats:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            throw error;
        }
    },

    // Get recent test results - simplified approach
    async getRecentTests(userId: string, limitCount: number = 10): Promise<(FirestoreTestResult & { id: string })[]> {
        try {
            console.log('Fetching recent tests for user:', userId, 'limit:', limitCount);

            // Simple query with just userId filter
            let testsQuery;

            try {
                // Try compound query first (requires index)
                testsQuery = query(
                    collection(db, 'testResults'),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc'),
                    limit(limitCount)
                );
                console.log('Using compound query with orderBy');
            } catch (indexError) {
                console.log('Compound query failed, falling back to simple query:', indexError);
                // Fallback to simple query if index doesn't exist
                testsQuery = query(
                    collection(db, 'testResults'),
                    where('userId', '==', userId),
                    limit(limitCount * 3) // Get more to sort in memory
                );
            }

            const querySnapshot = await getDocs(testsQuery);
            console.log('Query executed, found documents:', querySnapshot.size);

            const tests: (FirestoreTestResult & { id: string })[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data() as {
                    userId: string;
                    wpm: number;
                    accuracy: number;
                    correct: number;
                    incorrect: number;
                    missed: number;
                    totalTime: number;
                    charCount: number;
                    settings: any;
                    wpmHistory: any[];
                    createdAt: any;
                };

                console.log('Processing test document:', doc.id, data);

                tests.push({
                    id: doc.id,
                    userId: data.userId,
                    wpm: data.wpm,
                    accuracy: data.accuracy,
                    correct: data.correct,
                    incorrect: data.incorrect,
                    missed: data.missed,
                    totalTime: data.totalTime,
                    charCount: data.charCount,
                    settings: data.settings,
                    wpmHistory: data.wpmHistory,
                    createdAt: data.createdAt
                });
            });

            // Sort by createdAt in memory if we used simple query
            const sortedTests = tests
                .sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return b.createdAt.toMillis() - a.createdAt.toMillis();
                })
                .slice(0, limitCount);

            console.log('Final sorted tests:', sortedTests.length);
            return sortedTests;
        } catch (error: any) {
            console.error('Error fetching recent tests:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // If it's a permission error, provide more context
            if (error.code === 'permission-denied') {
                console.error('Permission denied - check Firestore security rules');
                throw new Error('Permission denied: Check if you are logged in and Firestore rules allow access');
            }

            // If it's an index error, provide helpful message
            if (error.code === 'failed-precondition' || error.message.includes('index')) {
                console.error('Missing index - this query requires a composite index');
                throw new Error('Missing Firestore index: This query requires a composite index. Check the console for the index creation link.');
            }

            throw error;
        }
    }
};
