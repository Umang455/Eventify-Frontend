import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


export const useUserStore = create(
    persist(
        set => ({
            userDetailsStore: null,
            isUserLoggedInStore: false,
            updateIsUserLoggedIn: isUserLoggedInStore => set({ isUserLoggedInStore }),
            updateUserDetails: userDetailsStore => set({ userDetailsStore }),
        }),
        {
            name: 'user-storage', // name of the item in the storage (must be unique)
            // getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        },
    ),
);

