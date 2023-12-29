//import { clerkClient } from "@clerk/nextjs/server";
//import { NextApiRequest, NextApiResponse } from "next";

//export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//try {
// Liste aller Benutzer abrufen
// const userList = await clerkClient.users.getUserList();

// Jeden Benutzer löschen
//for (const user of userList) {
//await clerkClient.users.deleteUser(user.id);
//}

//  return res.status(200).json({ message: 'Alle Benutzer erfolgreich gelöscht' });
// }
//catch (error) {
//console.log(error);
//return res.status(500).json({ error: 'Fehler beim Löschen der Benutzer' });
//}
//}
