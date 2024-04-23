import { FirebaseError } from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

import * as admin from 'firebase-admin';

admin.apps.length === 0
  ? admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  : admin;

type UserID = {
  id: string;
};

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const data = (await request.json()) as UserID;
    await admin.auth().deleteUser(data.id);
    await admin
      .database()
      .ref('Users/' + data.id)
      .remove();
    return NextResponse.json({ message: 'Successfully deleted user' });
  } catch (error) {
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/user-not-found')
      return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json({
      message: 'Something went wrong when deleting user',
    });
  }
}
