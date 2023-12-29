// utils/saveUser.js
import User from '../models/User';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function saveUser(evt: WebhookEvent) {
  try {
    const data = evt.data as any; 
    const { id } = data;
    const firstName = data.first_name; 
    const lastName = data.last_name;
    const username = data.username; 

    if (typeof id === 'string') {  
      const user = new User({
        clerkId: id,
        username: username,
        firstName: firstName,
        lastName: lastName,
      });

      await user.save();
    } else {
      console.error('Missing or incorrect types for id');
      throw new Error('Missing or incorrect types for id');
    }
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

