
import React from 'react';
import { Group } from '@/types/lms';
import GroupCard from './GroupCard';

interface GroupListProps {
    groups: Group[];
    selectedGroup: string | null;
    setSelectedGroup: (id: string | null) => void;
    onEnterClassroom: (groupId: string) => void;
}

export default function GroupList({ groups, selectedGroup, setSelectedGroup, onEnterClassroom }: GroupListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group, index) => (
                <GroupCard 
                    key={group.id} 
                    group={group} 
                    index={index}
                    isSelected={selectedGroup === group.id}
                    onSelect={setSelectedGroup}
                    onEnterClassroom={onEnterClassroom}
                />
            ))}
        </div>
    );
}
