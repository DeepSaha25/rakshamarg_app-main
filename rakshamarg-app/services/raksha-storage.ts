import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChatMessage, TrustedContact, UserProfile } from '@/types/raksha';

const STORAGE_KEYS = {
  trustedContacts: 'raksha:trusted-contacts',
  profile: 'raksha:profile',
  lastRouteSummary: 'raksha:last-route-summary',
  chatHistory: 'raksha:chat-history',
};

export async function getTrustedContacts(): Promise<TrustedContact[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.trustedContacts);
  return raw ? (JSON.parse(raw) as TrustedContact[]) : [];
}

export async function saveTrustedContacts(contacts: TrustedContact[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.trustedContacts, JSON.stringify(contacts));
}

export async function getProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.profile);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

export async function saveLastRouteSummary(summary: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.lastRouteSummary, summary);
}

export async function getLastRouteSummary(): Promise<string> {
  return (await AsyncStorage.getItem(STORAGE_KEYS.lastRouteSummary)) ?? '';
}

export async function saveChatHistory(messages: ChatMessage[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(messages));
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.chatHistory);
  return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
}
