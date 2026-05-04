import { useState, useEffect, useRef } from 'react';
import { Reminder, ReminderType } from './types';
import { APP_NAME } from './constants';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('reminders');
    if (saved) {
      try {
        setReminders(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse reminders", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const requestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const addReminder = (
    message: string, 
    type: ReminderType,
    intervalMinutes?: number, 
    specificTime?: string,
    specificDate?: string,
    description?: string,
    soundUrl: string = ''
  ) => {
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      message,
      description,
      type,
      intervalMinutes,
      specificTime,
      specificDate,
      soundUrl,
      isActive: true,
      createdAt: Date.now(),
      lastNotifiedAt: null,
    };
    setReminders(prev => [newReminder, ...prev]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const updateReminder = (
    id: string,
    message: string,
    type: ReminderType,
    intervalMinutes?: number,
    specificTime?: string,
    specificDate?: string,
    description?: string,
    soundUrl: string = ''
  ) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { 
        ...r, 
        message, 
        type, 
        intervalMinutes, 
        specificTime, 
        specificDate, 
        description, 
        soundUrl 
      } : r
    ));
  };

  const updateLastNotified = (id: string, timestamp: number) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, lastNotifiedAt: timestamp } : r
    ));
  };

  const playNotificationSound = (url: string) => {
    if (!url) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(url);
    audioRef.current.play().catch(e => console.warn("Audio play failed:", e));
  };

  const notify = (reminder: Reminder) => {
    if (permission === 'granted') {
      new Notification(APP_NAME, {
        body: reminder.message,
        vibrate: [200, 100, 200]
      });
    }
    playNotificationSound(reminder.soundUrl);
    updateLastNotified(reminder.id, Date.now());
  };

  // Main loop to check reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTimestamp = now.getTime();
      const currentHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentYYYYMMDD = now.toISOString().split('T')[0];

      setReminders(prev => {
        let hasChanges = false;
        const updated = prev.map(reminder => {
          if (!reminder.isActive) return reminder;

          if (reminder.type === 'interval' && reminder.intervalMinutes) {
            const lastTime = reminder.lastNotifiedAt || reminder.createdAt;
            const intervalMs = reminder.intervalMinutes * 60 * 1000;
            if (currentTimestamp - lastTime >= intervalMs) {
              notify(reminder);
              hasChanges = true;
            }
          } 
          else if (reminder.type === 'specific' && reminder.specificTime) {
            // Check if it's the exact minute
            const timeMatch = reminder.specificTime === currentHHmm;
            
            // Check if date matches (if provided)
            let dateMatch = true;
            if (reminder.specificDate) {
              dateMatch = reminder.specificDate === currentYYYYMMDD;
            }

            const alreadyNotifiedNow = reminder.lastNotifiedAt && 
                                      new Date(reminder.lastNotifiedAt).getMinutes() === now.getMinutes() &&
                                      new Date(reminder.lastNotifiedAt).getHours() === now.getHours() &&
                                      new Date(reminder.lastNotifiedAt).toDateString() === now.toDateString();
            
            if (timeMatch && dateMatch && !alreadyNotifiedNow) {
              notify(reminder);
              hasChanges = true;
            }
          }
          return reminder;
        });

        return updated;
      });
    }, 1000 * 5); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [permission]); // Don't depend on reminders directly to avoid infinite loops, we handle state updates carefully

  return {
    reminders,
    addReminder,
    updateReminder,
    toggleReminder,
    deleteReminder,
    requestPermission,
    permission,
    playNotificationSound
  };
}
