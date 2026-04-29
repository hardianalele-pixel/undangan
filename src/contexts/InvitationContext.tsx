import React, { createContext, useContext } from 'react';
import type { InvitationDocument } from '../types';

interface InvitationContextValue {
    invite: InvitationDocument;
    guestName: string | null;
    isPreview: boolean;
    handleRsvpSubmit: (data: any) => void;
}

const InvitationContext = createContext<InvitationContextValue | null>(null);

export function InvitationProvider({
    children,
    invite,
    guestName,
    isPreview = false,
    handleRsvpSubmit,
}: {
    children: React.ReactNode;
    invite: InvitationDocument;
    guestName: string | null;
    isPreview?: boolean;
    handleRsvpSubmit: (data: any) => void;
}) {
    return (
        <InvitationContext.Provider value={{ invite, guestName, isPreview, handleRsvpSubmit }}>
            {children}
        </InvitationContext.Provider>
    );
}

export function useInvitation() {
    const context = useContext(InvitationContext);
    if (!context) {
        throw new Error('useInvitation must be used within an InvitationProvider');
    }
    return context;
}
