import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  email: string;
  fullName: string;
  role: 'admin' | 'doctor' | 'user';
  doctorId?: string; // Optional doctor ID reference
}

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  userProfile: UserProfile | null;
  users: Array<{ email: string; fullName: string; role: 'admin' | 'doctor' | 'user'; doctorId?: string }>;
  login: (email: string, pass: string) => boolean;
  signUp: (email: string, pass: string, fullName: string) => boolean;
  addDoctorCredentials: (email: string, pass: string, fullName: string, doctorId: string) => boolean;
  updateDoctorPassword: (email: string, newPass: string) => boolean;
  deleteUser: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  email: null,
  userProfile: null,
  users: [],
  login: () => false,
  signUp: () => false,
  addDoctorCredentials: () => false,
  updateDoctorPassword: () => false,
  deleteUser: () => {},
  logout: () => {},
});

const INITIAL_USERS = [
  { email: 'admin@amrutam.co', password: 'ayurveda123', fullName: 'Amrutam Admin', role: 'admin' as const },
  { email: 'user@amrutam.co', password: 'ayurveda123', fullName: 'Ayurvedic Enthusiast', role: 'user' as const },
  { email: 'doctor@amrutam.co', password: 'ayurveda123', fullName: 'Dr. Charak Kumar', role: 'doctor' as const, doctorId: 'doc_charak' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const login = (inputEmail: string, pass: string): boolean => {
    const trimmedEmail = inputEmail.toLowerCase().trim();
    const foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail && u.password === pass);
    
    if (foundUser) {
      setIsAuthenticated(true);
      setEmail(foundUser.email);
      setUserProfile({
        email: foundUser.email,
        fullName: foundUser.fullName,
        role: foundUser.role,
        doctorId: foundUser.doctorId,
      });
      return true;
    }
    return false;
  };

  const signUp = (inputEmail: string, pass: string, fullName: string): boolean => {
    const trimmedEmail = inputEmail.toLowerCase().trim();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return false;
    }

    const newUser = {
      email: inputEmail.trim(),
      password: pass,
      fullName: fullName.trim(),
      role: 'user' as const,
    };

    setUsers(prev => [...prev, newUser]);
    return true;
  };

  const addDoctorCredentials = (inputEmail: string, pass: string, fullName: string, doctorId: string): boolean => {
    const trimmedEmail = inputEmail.toLowerCase().trim();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return false;
    }

    const newDocUser = {
      email: inputEmail.trim(),
      password: pass,
      fullName: fullName.trim(),
      role: 'doctor' as const,
      doctorId,
    };

    setUsers(prev => [...prev, newDocUser]);
    return true;
  };

  const updateDoctorPassword = (inputEmail: string, newPass: string): boolean => {
    const trimmedEmail = inputEmail.toLowerCase().trim();
    if (!users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return false;
    }

    setUsers(prev => prev.map(u => u.email.toLowerCase() === trimmedEmail ? { ...u, password: newPass } : u));
    return true;
  };

  const deleteUser = (emailToDelete: string) => {
    setUsers(prev => prev.filter(u => u.email.toLowerCase() !== emailToDelete.toLowerCase()));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail(null);
    setUserProfile(null);
  };

  // Expose users list omitting passwords
  const publicUsers = users.map(({ password, ...rest }) => rest);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      email,
      userProfile,
      users: publicUsers,
      login,
      signUp,
      addDoctorCredentials,
      updateDoctorPassword,
      deleteUser,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
