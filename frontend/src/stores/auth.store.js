import { create } from "zustand";

const useAuthStore = create((set) => ({
  AuthUser: null,

  Messages: [],

  SelectedUser: null,

  IsAddChatBoxShown: false,

  Users: [],

  showDialogBox: false,
  setShowDialogBox: (s) => set(() => ({ showDialogBox: s })),

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

  connectedUsers: [],
  setConnectedUsers: (updater) =>
    set((state) => ({
      connectedUsers:
        typeof updater === "function"
          ? updater(state.connectedUsers)
          : updater,
    })),

}));

export default useAuthStore;
