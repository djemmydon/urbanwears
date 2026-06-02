import { create } from "zustand";
import { supabase } from "./supabase";

interface AuthUser {
    id: string;
    email: string;
    fullName?: string;
}

interface AuthStore {
    user: AuthUser | null;
    loading: boolean;
    setUser: (user: AuthUser | null) => void;
    setLoading: (v: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),

    checkSession: async () => {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session?.user) {
            set({
                user: {
                    id: session.user.id,
                    email: session.user.email ?? "",
                    fullName: session.user.user_metadata?.full_name ?? "",
                },
                loading: false,
            });
        } else {
            set({ user: null, loading: false });
        }
    },

    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            if (error.code === "email_not_confirmed") {
                throw new Error("Please confirm your email first. Check your inbox for a confirmation link.");
            }
            throw new Error(error.message);
        }
        if (data.user) {
            set({
                user: {
                    id: data.user.id,
                    email: data.user.email ?? "",
                    fullName: data.user.user_metadata?.full_name ?? "",
                },
            });
        }
    },

    register: async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) throw new Error(error.message);
        if (data.user) {
            set({
                user: {
                    id: data.user.id,
                    email: data.user.email ?? "",
                    fullName,
                },
            });
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null });
    },
}));
