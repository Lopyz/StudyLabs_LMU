import User from '../models/User';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function updateUser(evt: WebhookEvent) {
  try {
    const data = evt.data as any;
    const { id, first_name, last_name, username } = data;

    if (typeof id === 'string') {
      const user = await User.findOne({ clerkId: id });

      if (user) {
        if (first_name !== undefined) user.firstName = first_name;
        if (last_name !== undefined) user.lastName = last_name;
        if (username !== undefined) user.username = username;

        await user.save();
      } else {
        console.error('User not found');
      }
    } else {
      console.error('Missing or incorrect types for id');
      throw new Error('Missing or incorrect types for id');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
