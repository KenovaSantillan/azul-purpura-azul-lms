
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface EmptyStateProps {
    message: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
}

export default function EmptyState({ message, description, actionText, onAction }: EmptyStateProps) {
    return (
        <Card className="text-center py-12">
            <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{message}</h3>
                {description && (
                    <p className="text-muted-foreground mb-4">
                        {description}
                    </p>
                )}
                {onAction && actionText && (
                    <Button onClick={onAction} className="bg-lms-purple-500 hover:bg-lms-purple-600">
                        {actionText}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
