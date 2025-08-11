// store.js
import { create } from 'zustand';

const useValidationStore = create<ValidationStore>((set) => ({
    referrer: '',
    setReferrer: (newReferrer: string) => set({ referrer: newReferrer }),
}));

export default useValidationStore;