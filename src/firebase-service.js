import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDELAJYKs4fSU1kbkJVODI22daC3DZ7PDQ",
  authDomain: "member-card-studio.firebaseapp.com",
  projectId: "member-card-studio",
  storageBucket: "member-card-studio.firebasestorage.app",
  messagingSenderId: "355842740295",
  appId: "1:355842740295:web:6d14737c2f09da85c92162"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const stateRef = doc(db, "system", "member-card-studio-state");

async function ensureFirebaseAuth() {
  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}

export async function loadFirebaseState() {
  await ensureFirebaseAuth();
  const snapshot = await getDoc(stateRef);
  if (!snapshot.exists()) return null;
  return snapshot.data()?.state || null;
}

export async function saveFirebaseState(state) {
  await ensureFirebaseAuth();
  await setDoc(stateRef, {
    app: "member-card-studio",
    version: 1,
    updatedAt: serverTimestamp(),
    state
  }, { merge: true });
}

export const firebaseProjectId = firebaseConfig.projectId;
