/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, Plus, Trash2, Play, Clock, Music, CheckCircle2, AlertCircle, CalendarDays, Timer } from 'lucide-react';
import { useReminders } from './useReminders';
import { SOUND_OPTIONS, APP_NAME, APP_DESCRIPTION } from './constants';
import { ReminderType } from './types';

export default function App() {
  const { 
    reminders, 
    addReminder, 
    toggleReminder, 
    deleteReminder, 
    requestPermission, 
    permission,
    playNotificationSound
  } = useReminders();

  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ReminderType>('interval');
  const [interval, setInterval] = useState(5);
  const [specificTime, setSpecificTime] = useState('10:00');
  const [soundUrl, setSoundUrl] = useState(SOUND_OPTIONS[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addReminder(
      message, 
      type, 
      type === 'interval' ? interval : undefined, 
      type === 'specific' ? specificTime : undefined, 
      soundUrl
    );
    setMessage('');
    setInterval(5);
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{APP_NAME}</h1>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAdding(prev => !prev)}
            className={`p-2 rounded-full transition-all duration-300 ${isAdding ? 'bg-indigo-100 text-indigo-600 rotate-45' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            id="toggle-add-btn"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Permission Notice */}
        {permission !== 'granted' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between"
            id="permission-banner"
          >
            <div className="flex items-center gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">কাজ করার জন্য নোটিফিকেশন পারমিশন প্রয়োজন</p>
            </div>
            <button 
              onClick={requestPermission}
              className="bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
            >
              অনুমতি দিন
            </button>
          </motion.div>
        )}

        {/* Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <form 
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6"
                id="add-reminder-form"
              >
                <div className="space-y-4">
                   <div className="flex p-1 bg-gray-50 rounded-2xl w-full max-w-sm mx-auto">
                    <button
                      type="button"
                      onClick={() => setType('interval')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'interval' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}
                    >
                      <Timer className="w-4 h-4" /> সময় অন্তর
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('specific')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${type === 'specific' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400'}`}
                    >
                      <CalendarDays className="w-4 h-4" /> নির্দিষ্ট সময়
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">বার্তা</label>
                    <input 
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="কি মনে করিয়ে দিতে হবে?"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {type === 'interval' ? 'কতো সময় পর পর' : 'কখন'}
                    </label>
                    <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                      {type === 'interval' ? (
                        <>
                          <Clock className="w-5 h-5 text-gray-400 ml-3" />
                          <div className="flex items-center w-full pr-3">
                            <input 
                              type="number"
                              min="1"
                              value={interval}
                              onChange={(e) => setInterval(Number(e.target.value))}
                              className="w-full py-2 bg-transparent outline-none text-indigo-600 font-semibold"
                            />
                            <span className="text-xs font-bold text-gray-400">মিনিট</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center w-full px-3">
                           <CalendarDays className="w-5 h-5 text-gray-400 mr-2" />
                           <input 
                            type="time"
                            value={specificTime}
                            onChange={(e) => setSpecificTime(e.target.value)}
                            className="w-full py-2 bg-transparent outline-none text-indigo-600 font-semibold"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">সাউন্ড</label>
                    <div className="flex items-center gap-2">
                      <select 
                        value={soundUrl}
                        onChange={(e) => setSoundUrl(e.target.value)}
                        className="w-full px-3 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium appearance-none"
                      >
                        {SOUND_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.url}>{opt.name}</option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        onClick={() => playNotificationSound(soundUrl)}
                        className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <Play className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-[0.98]"
                >
                  রিমাইন্ডার সেট করুন
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reminders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">আপনার রিমাইন্ডারসমূহ</h2>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
              {reminders.length} টি
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {reminders.map((reminder) => (
              <motion.div
                key={reminder.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-md ${!reminder.isActive && 'grayscale opacity-60'}`}
                id={`reminder-${reminder.id}`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleReminder(reminder.id)}
                    className={`p-3 rounded-2xl transition-all ${reminder.isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {reminder.isActive ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
                  </button>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{reminder.message}</h3>
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                      <span className="flex items-center gap-1">
                        {reminder.type === 'interval' ? (
                          <><Clock className="w-3.5 h-3.5" /> {reminder.intervalMinutes} মিনিট অন্তর</>
                        ) : (
                          <><CalendarDays className="w-3.5 h-3.5" /> প্রতিদিন {reminder.specificTime} এ</>
                        )}
                      </span>
                      {reminder.lastNotifiedAt && (
                        <span className="flex items-center gap-1 text-indigo-500">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 
                          শেষ: {new Date(reminder.lastNotifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => playNotificationSound(reminder.soundUrl)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {reminders.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <div className="bg-white w-16 h-16 rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium tracking-tight">সব কিছু শান্ত... কোনো রিমাইন্ডার নেই</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
              >
                প্রথম রিমাইন্ডারটি যোগ করুন
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-3xl mx-auto px-4 pb-12 mt-12">
        <div className="bg-indigo-900 rounded-[32px] p-8 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">{APP_DESCRIPTION}</h3>
            <p className="text-indigo-200 text-sm max-w-sm mx-auto leading-relaxed">
              এই অ্যাপটি ব্যাকগ্রাউন্ডে সক্রিয় থাকলেই কেবল নোটিফিকেশন পাঠাতে পারবে। নিয়মিত সময় অন্তর বা নির্দিষ্ট সময়ে কাজের কথা মনে রাখতে এটি আপনাকে সাহায্য করবে।
            </p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-800 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 bg-indigo-700 rounded-full blur-3xl opacity-50" />
        </div>
      </footer>
    </div>
  );
}

