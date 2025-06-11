import { create } from "zustand";

const useAuthStore = create((set) => ({
  AuthUser: null,

  Messages: [],

  SelectedUser: null,

  IsAddChatBoxShown: false,

  Users: [],

  showDialogBox:false,
  setShowDialogBox:(s)=>set(()=>({showDialogBox:s})),

  setUsers: (users) => set(() => ({ Users: users })),

  setIsAddChatBoxShown: (state) => set(() => ({ IsAddChatBoxShown: state })),

  setAuthUser: (user) => set(() => ({ AuthUser: user })),

  setMessages: (updater) =>
    set((state) => ({
      Messages:
        typeof updater === "function"
          ? updater(state.Messages)
          : updater,
    })),

  setSelectedUser: (selectedUser) => set(() => ({ SelectedUser: selectedUser })),

}));

export default useAuthStore;
