import User from '../models/User';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function deleteUser(evt: WebhookEvent) {
  try {
    const data = evt.data as any;
    const { id } = data;

    if (typeof id === 'string') {
      const result = await User.deleteOne({ clerkId: id });

      if (result.deletedCount === 0) {
        console.error('User not found');
      }
    } else {
      console.error('Missing or incorrect types for id');
      throw new Error('Missing or incorrect types for id');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
} 
