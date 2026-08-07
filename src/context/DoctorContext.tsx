import React, { createContext, useContext, useState } from 'react';
import { Doctor } from '../types';
import { generateDoctors } from '../data/generators';

interface DoctorContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Doctor;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (id: string) => void;
}

const DoctorContext = createContext<DoctorContextType>({
  doctors: [],
  addDoctor: () => ({} as Doctor),
  updateDoctor: () => {},
  deleteDoctor: () => {},
});

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-seed with a reasonable number of doctors (e.g. 50) for good performance and editable lists
  const [doctors, setDoctors] = useState<Doctor[]>(() => generateDoctors(50));

  const addDoctor = (newDocData: Omit<Doctor, 'id'>): Doctor => {
    const newDoc: Doctor = {
      ...newDocData,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setDoctors(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDoctor = (updatedDoc: Doctor) => {
    setDoctors(prev => prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <DoctorContext.Provider value={{ doctors, addDoctor, updateDoctor, deleteDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctors = () => useContext(DoctorContext);
