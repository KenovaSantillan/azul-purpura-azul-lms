import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLMS } from '@/contexts/LMSContext';
import { GroupChatMessage } from '@/types/lms';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface GroupChatProps {
  groupId: string;
}

const GroupChat: React.FC<GroupChatProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<GroupChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser, sendGroupChatMessage } = useLMS();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('group_chat_messages')
        .select('*, profiles(first_name, last_name, avatar_url)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data as GroupChatMessage[]);
      }
      setLoading(false);
    };

    if (groupId) {
      fetchMessages();
    }
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    
    const channel = supabase
      .channel(`group-chat-${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_chat_messages',
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          const { data, error } = await supabase
            .from('group_chat_messages')
            .select('*, profiles(first_name, last_name, avatar_url)')
            .eq('id', payload.new.id)
            .single();
            
          if (error) {
            console.error('Error fetching new message with profile:', error);
          } else if (data) {
            setMessages((prevMessages) => [...prevMessages, data as GroupChatMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !groupId) return;
    
    try {
      await sendGroupChatMessage(groupId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      // Error is already toasted in context function
    }
  };

  const getFullName = (profile: { first_name: string | null; last_name: string | null } | null | undefined) => {
    if (!profile) return 'Usuario';
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    return fullName || 'Usuario';
  };

  const getInitials = (name: string | null | undefined) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-card rounded-lg border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4 p-4">
            <div className="flex gap-2 items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-10 w-3/4" />
            </div>
             <div className="flex gap-2 items-center justify-end">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
             <div className="flex gap-2 items-center">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-10 w-2/3" />
            </div>
          </div>
        ) : messages.map((msg) => {
          const profileName = getFullName(msg.profiles);
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.user_id === currentUser?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.user_id !== currentUser?.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.profiles?.avatar_url ?? undefined} alt={profileName} />
                  <AvatarFallback>{getInitials(profileName)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 ${
                  msg.user_id === currentUser?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.user_id !== currentUser?.id && (
                  <p className="text-xs font-bold mb-1">{profileName}</p>
                )}
                <p className="text-sm break-words">{msg.content}</p>
                <p className={`text-xs mt-1 text-right ${
                  msg.user_id === currentUser?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: es })}
                </p>
              </div>
               {msg.user_id === currentUser?.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-background/50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            autoComplete="off"
            disabled={!groupId}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || !groupId}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
