
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface EmptyStateProps {
    onAction: () => void;
}

export default function EmptyState({ onAction }: EmptyStateProps) {
    return (
        <Card className="text-center py-12">
            <CardContent>
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay grupos creados</h3>
                <p className="text-muted-foreground mb-4">
                    Crea tu primer grupo para comenzar a gestionar estudiantes
                </p>
                <Button onClick={onAction} className="bg-lms-purple-500 hover:bg-lms-purple-600">
                    Crear Primer Grupo
                </Button>
            </CardContent>
        </Card>
    );
}
