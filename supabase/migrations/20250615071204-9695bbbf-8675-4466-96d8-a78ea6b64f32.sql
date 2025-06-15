
-- Create table for group chat messages
CREATE TABLE public.group_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

COMMENT ON TABLE public.group_chat_messages IS 'Stores chat messages for each group.';

-- Enable Row-Level Security
ALTER TABLE public.group_chat_messages ENABLE ROW LEVEL SECURITY;

-- These policies depend on the helper functions is_group_member() and is_group_teacher()
-- and will only work correctly if the 'group_members' and 'groups' tables are populated.
CREATE POLICY "Allow read access to group members and teachers"
ON public.group_chat_messages FOR SELECT
USING ( is_group_member(group_id, auth.uid()) OR is_group_teacher(group_id, auth.uid()) );

CREATE POLICY "Allow insert access to group members and teachers"
ON public.group_chat_messages FOR INSERT
WITH CHECK ( is_group_member(group_id, auth.uid()) OR is_group_teacher(group_id, auth.uid()) );

-- Enable real-time functionality for the new table
ALTER TABLE public.group_chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chat_messages;
