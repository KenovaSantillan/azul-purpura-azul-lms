
import React, { createContext, useContext } from 'react';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChatContextType {
  sendGroupChatMessage: (groupId: string, content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUser();

  const sendGroupChatMessage = async (groupId: string, content: string) => {
    if (!currentUser) {
      toast.error("Debes iniciar sesión para enviar mensajes.");
      throw new Error("User not authenticated");
    }

    const { error } = await supabase.from('group_chat_messages').insert({
      group_id: groupId,
      user_id: currentUser.id,
      content: content,
    });

    if (error) {
      toast.error("Error al enviar el mensaje.");
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const value = { sendGroupChatMessage };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
