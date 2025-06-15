
```typescript
import React, { createContext, useContext } from 'react';
import { Group, Task, Announcement, StudentProgress, Team, TaskSubmission, Resource } from '@/types/lms';
import { GroupProvider, useGroups, GroupContextType } from './GroupContext';
import { TaskProvider, useTasks, TaskContextType } from './TaskContext';
import { AnnouncementProvider, useAnnouncements, AnnouncementContextType } from './AnnouncementContext';
import { TeamProvider, useTeams, TeamContextType } from './TeamContext';
import { ChatProvider, useChat, ChatContextType } from './ChatContext';
import { ResourceProvider, useLMSResources, ResourceContextType } from './ResourceContext';

type LMSContextType = GroupContextType & TaskContextType & AnnouncementContextType & TeamContextType & ChatContextType & ResourceContextType;

const LMSContext = createContext<LMSContextType | undefined>(undefined);

const LMSProviderContent = ({ children }: { children: React.ReactNode }) => {
  const groupsContext = useGroups();
  const tasksContext = useTasks();
  const announcementsContext = useAnnouncements();
  const teamsContext = useTeams();
  const chatContext = useChat();
  const resourcesContext = useLMSResources();

  const combinedContextValue: LMSContextType = {
    ...groupsContext,
    ...tasksContext,
    ...announcementsContext,
    ...teamsContext,
    ...chatContext,
    ...resourcesContext,
  };

  return (
    <LMSContext.Provider value={combinedContextValue}>
      {children}
    </LMSContext.Provider>
  );
};

export function LMSProvider({ children }: { children: React.ReactNode }) {
  return (
    <GroupProvider>
      <TaskProvider>
        <AnnouncementProvider>
          <TeamProvider>
            <ChatProvider>
              <ResourceProvider>
                <LMSProviderContent>
                  {children}
                </LMSProviderContent>
              </ResourceProvider>
            </ChatProvider>
          </TeamProvider>
        </AnnouncementProvider>
      </TaskProvider>
    </GroupProvider>
  );
}

export function useLMS() {
  const context = useContext(LMSContext);
  if (context === undefined) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
}
```
