
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { debounce } from 'lodash';

export interface RoomData {
  id: string;
  male_story: string;
  male_feelings: string;
  female_story: string;
  female_feelings: string;
}

const DEFAULT_ROOM: RoomData = {
  id: '',
  male_story: '',
  male_feelings: '',
  female_story: '',
  female_feelings: '',
};

export const useRoomSync = (roomId: string, role: 'male' | 'female') => {
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<RoomData>(DEFAULT_ROOM);
  
  // Use a ref to track if we are currently saving to avoid overwriting local changes with old echoes
  const isSavingRef = useRef(false);

  // 1. Initial Fetch or Create
  useEffect(() => {
    if (!roomId) return;

    const fetchOrCreateRoom = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (error) {
           // If error code is specifically "Row not found" (PGRST116), create it.
           // However, if the error is due to connection/auth (missing env vars), we should handle it.
           if (error.code === 'PGRST116') {
              const newRoom = { ...DEFAULT_ROOM, id: roomId };
              const { error: insertError } = await supabase
                .from('rooms')
                .insert([newRoom]);
              
              if (insertError) throw insertError;
              setRoomData(newRoom);
           } else {
             // Other errors (e.g., auth failed, network error)
             console.error('Supabase fetch error:', error);
             // We stop loading so the user isn't stuck on a spinner
           }
        } else if (data) {
          setRoomData(data);
        }
      } catch (err) {
        console.error('Error fetching room:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateRoom();
  }, [roomId]);

  // 2. Realtime Subscription
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const newData = payload.new as RoomData;
          if (!newData) return;

          setRoomData((prev) => {
            // Optimistic update logic
            if (role === 'male') {
              return {
                ...prev,
                female_story: newData.female_story,
                female_feelings: newData.female_feelings,
                 male_story: isSavingRef.current ? prev.male_story : newData.male_story,
                 male_feelings: isSavingRef.current ? prev.male_feelings : newData.male_feelings,
              };
            } else {
              return {
                ...prev,
                male_story: newData.male_story,
                male_feelings: newData.male_feelings,
                female_story: isSavingRef.current ? prev.female_story : newData.female_story,
                female_feelings: isSavingRef.current ? prev.female_feelings : newData.female_feelings,
              };
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, role]);

  // 3. Debounced Update Functions
  const debouncedUpdateRef = useRef(
    debounce(async (id: string, updates: Partial<RoomData>) => {
      isSavingRef.current = true;
      const { error } = await supabase.from('rooms').update(updates).eq('id', id);
      if (error) console.error("Update failed", error);
      isSavingRef.current = false;
    }, 500)
  );

  const updateMale = useCallback((story: string, feelings: string) => {
    setRoomData(prev => ({ ...prev, male_story: story, male_feelings: feelings }));
    debouncedUpdateRef.current(roomId, { male_story: story, male_feelings: feelings });
  }, [roomId]);

  const updateFemale = useCallback((story: string, feelings: string) => {
    setRoomData(prev => ({ ...prev, female_story: story, female_feelings: feelings }));
    debouncedUpdateRef.current(roomId, { female_story: story, female_feelings: feelings });
  }, [roomId]);

  return {
    loading,
    roomData,
    updateMale,
    updateFemale,
  };
};
