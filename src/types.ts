export type ReminderType = 'interval' | 'specific';

export interface Reminder {
  id: string;
  message: string;
  description?: string;
  type: ReminderType;
  intervalMinutes?: number;
  specificTime?: string; // HH:mm format
  specificDate?: string; // YYYY-MM-DD format
  soundUrl: string;
  isActive: boolean;
  createdAt: number;
  lastNotifiedAt: number | null;
}

export interface SoundOption {
  id: string;
  name: string;
  url: string;
}
