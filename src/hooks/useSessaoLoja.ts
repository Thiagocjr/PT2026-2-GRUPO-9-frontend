'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';

export type EstadoSessaoLoja =
  | { status: 'checking' }
  | { status: 'visitor' }
  | { status: 'authenticated'; userId: number };

export function useSessaoLoja(ownerId?: number) {
  const [session, setSession] = useState<EstadoSessaoLoja>({ status: 'checking' });

  useEffect(() => {
    let active = true;
    const token = typeof window === 'undefined' ? null : localStorage.getItem('@App:token');

    Promise.resolve(token)
      .then((storedToken) => storedToken ? getCurrentUser() : null)
      .then((user) => {
        const validUserId = user && Number.isInteger(user.id) ? user.id : null;
        if (active) {
          setSession(validUserId === null ? { status: 'visitor' } : { status: 'authenticated', userId: validUserId });
        }
      })
      .catch(() => { if (active) setSession({ status: 'visitor' }); });

    return () => { active = false; };
  }, []);

  const authenticated = session.status === 'authenticated';
  return {
    status: session.status,
    userId: authenticated ? session.userId : null,
    authenticated,
    isOwner: authenticated && ownerId !== undefined && session.userId === ownerId,
  };
}
