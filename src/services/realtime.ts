import { supabase } from '../lib/supabase';

// Realtime subscriptions
export const subscribeToDraftUpdates = (callback: () => void) => {
  const subscription = supabase
    .channel('draft-updates')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'draft_picks' },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const subscribeToPlayerUpdates = (callback: () => void) => {
  const subscription = supabase
    .channel('player-updates')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players' },
      () => {
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

