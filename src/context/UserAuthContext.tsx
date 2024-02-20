import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";

type User = {
  uid: string;
  email: string;
  displayName: string;
};

type UserAuthContextType = {
  user: User | null;
  logIn: (email: string, password: string) => Promise<void | UserCredential>;
  signUp: (email: string, password: string) => Promise<void | UserCredential>;
  logOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
};

const userAuthContext = createContext<UserAuthContextType | undefined>(
  undefined
);

export function UserAuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState(true);

  function logIn(email: string, password: string) {
    console.log("Email", email);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider).then(() => {});
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
      setPending(false) 
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if(pending){
    return <>Loading...</>
  }
  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(userAuthContext);
  if (context === undefined) {
    throw new Error(
      "useUserAuth must be used within a UserAuthContextProvider"
    );
  }
  return context;
}
