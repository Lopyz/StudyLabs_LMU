import axios from 'axios';
import { UserObj } from '../../../types/types';
import { connectToDB } from '@/utils/connectToDB';
import User from '@/models/User';

interface ClerkUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  last_sign_in_at: string;
}

export async function getTableData(): Promise<UserObj[]> {
  try {
    await connectToDB();
    
    let offset = 0;
    const limit = 200; // Maximale Anzahl von Benutzern pro Anfrage
    let allClerkUsers: ClerkUser[] = [];

    while (true) {
      const clerkResponse = await axios.get<ClerkUser[]>(`https://api.clerk.dev/v1/users?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      const clerkUsers = clerkResponse.data;
      allClerkUsers = allClerkUsers.concat(clerkUsers);

      if (clerkUsers.length < limit) {
        break; // Brechen Sie die Schleife ab, wenn die letzte Seite erreicht ist
      }

      offset += limit;
    }

    const mongoUsers = await User.find().lean().exec();

    // Kombiniere die Daten
    const userList: UserObj[] = allClerkUsers.map((clerkUser) => {
      const mongoUser = mongoUsers.find((mUser) => mUser.clerkId === clerkUser.id);
      
      return {
        username: clerkUser.username,
        name: `${clerkUser.first_name} ${clerkUser.last_name}`,
        date: new Date(clerkUser.last_sign_in_at).toLocaleDateString('de-DE', {
          second: '2-digit',
          minute: '2-digit',
          hour: '2-digit',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        gemachte_anfragen: mongoUser ? mongoUser.usage.toString() : 'N/A',
        verfügbare_anfragen: mongoUser ? (mongoUser.maxUsage - mongoUser.usage).toString() : 'N/A',
        edit: clerkUser.id,
      };
    });
    
    return userList;
    
  } catch (error) {
    console.error('Fehler beim Laden der Benutzerdaten:', error);
    return [];
  }
}