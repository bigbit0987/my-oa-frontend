import { create } from 'zustand';

interface UserState {
    name: string;
    avatar?: string;
    token?: string;
    setUser: (user: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>((set) => ({
    name: '张大工',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/efvPrtSjP2/notfound.png',
    setUser: (user) => set((state) => ({ ...state, ...user })),
}));
