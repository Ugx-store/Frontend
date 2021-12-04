import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDXgo_ZDeR30hhyeXJqIdrJniF1c2SoE1Q",
    authDomain: "refit-eac4b.firebaseapp.com",
    projectId: "refit-eac4b",
    storageBucket: "refit-eac4b.appspot.com",
    messagingSenderId: "228842897238",
    appId: "1:228842897238:web:a83299b7aadcfb654ce0f7",
    measurementId: "G-YX7541F2KL"
}

export const app = initializeApp(firebaseConfig);