
import { db } from './firebase-config';
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, writeBatch } from 'firebase/firestore';
import type { AdvancedMessage } from '@/components/advanced-chat/advanced-chat-client';
import type { Unsubscribe } from 'firebase/firestore';

const CHAT_COLLECTION = 'advanced-chat';

/**
 * Sends a message to the Firestore collection.
 * @param message - The message object to send.
 */
export const sendMessage = async (message: AdvancedMessage): Promise<void> => {
  try {
    // We don't store the decrypted text on the server
    const { text, ...messageToSend } = message;
    await addDoc(collection(db, CHAT_COLLECTION), messageToSend);
  } catch (error) {
    console.error('Error sending message: ', error);
    throw error;
  }
};

/**
 * Listens for new messages in the Firestore collection.
 * @param callback - The callback function to execute with the new messages.
 * @returns An unsubscribe function to stop listening for updates.
 */
export const listenForMessages = (callback: (messages: AdvancedMessage[]) => void): Unsubscribe => {
  const q = query(collection(db, CHAT_COLLECTION), orderBy('id', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages: AdvancedMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data() as AdvancedMessage);
    });
    callback(messages);
  }, (error) => {
    console.error("Error listening for messages: ", error);
  });

  return unsubscribe;
};

/**
 * Clears all messages from the Firestore collection.
 */
export const clearChatHistory = async (): Promise<void> => {
  try {
    const querySnapshot = await getDocs(collection(db, CHAT_COLLECTION));
    const batch = writeBatch(db);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Online chat history cleared successfully.');
  } catch (error) {
    console.error('Error clearing online chat history: ', error);
    throw error;
  }
};

/**
 * Clears chat history from local storage.
 */
export const clearLocalChatHistory = (): void => {
    try {
        localStorage.removeItem('advancedChatMessages');
    } catch (error) {
        console.error('Error clearing local chat history', error);
    }
}
