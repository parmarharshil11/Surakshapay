import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Send } from 'lucide-react';
import { subscribeToAlerts } from '../firebase';

export default function NotificationBell({ language, t }) {
  const [subscribed, setSubscribed] = useState(
    localStorage.getItem('notif_subscribed') === 'true'
  );
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  const showPushNotification = async (title, body) => {
    if (typeof Notification === 'undefined' || permission !== 'granted') return;
    
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            body,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
          });
          return;
        }
      }
    } catch (e) {
      console.error("Service worker notification failed:", e);
    }
    
    // Fallback for desktop browsers
    try {
      new Notification(title, { body, icon: '/favicon.ico' });
    } catch (e) {
      console.error("Fallback notification failed:", e);
    }
  };

  useEffect(() => {
    if (subscribed && permission === 'granted') {
      // Connect to Firestore real-time subscriber if active
      const unsubscribe = subscribeToAlerts((newScam) => {
        const title = newScam.title[language] || newScam.title['en'] || "New Scam Alert";
        const body = `Alert: Scammers active in ${newScam.region[language] || newScam.region['en'] || 'your region'}`;
        
        // Push local alert using SW fallback logic
        showPushNotification(`🚨 ${title}`, body);
        setUnreadCount(prev => prev + 1);
      });
      return () => unsubscribe();
    }
  }, [subscribed, permission, language]);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert("Push notifications not supported on this browser.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setSubscribed(true);
        localStorage.setItem('notif_subscribed', 'true');
        setToastMsg(t.notifSuccess || "You'll be notified of new scam alerts in your region!");
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      } else {
        setSubscribed(false);
        localStorage.setItem('notif_subscribed', 'false');
        setToastMsg(t.notifDenied || "Notifications blocked. Please enable in browser settings.");
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    } catch (err) {
      console.error("Permission request failed:", err);
    }
  };

  const toggleSubscription = () => {
    if (subscribed) {
      setSubscribed(false);
      localStorage.setItem('notif_subscribed', 'false');
      setUnreadCount(0);
    } else {
      requestPermission();
    }
  };

  const handleTestNotification = async () => {
    if (typeof Notification !== 'undefined' && permission === 'granted') {
      await showPushNotification(
        '🚨 New Alert: FedEx Scam',
        'Scammers impersonating FedEx are demanding customs fees via UPI.'
      );
      setUnreadCount(prev => prev + 1);
    } else {
      alert("Enable notifications first to test!");
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Bell Button */}
      <button
        onClick={toggleSubscription}
        className="p-2 rounded-xl bg-blue-800 hover:bg-blue-700 text-blue-200 hover:text-white transition-colors cursor-pointer border border-blue-750 relative focus:outline-none"
        title={t.notifBellLabel || "Alert Notifications"}
        aria-label={t.notifBellLabel || "Alert Notifications"}
      >
        {subscribed ? (
          <Bell className="w-4 h-4 fill-amber-400 text-amber-400" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
        
        {/* Animated unread count badge */}
        {subscribed && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Test trigger visible only when subscribed */}
      {subscribed && permission === 'granted' && (
        <button
          onClick={handleTestNotification}
          className="px-2.5 py-1.5 rounded-lg bg-blue-850 hover:bg-blue-800 text-[10px] font-bold text-blue-200 hover:text-white transition-all cursor-pointer border border-blue-750 flex items-center gap-1"
          title={t.notifTestBtn || "Send Test Alert"}
        >
          <Send className="w-3 h-3" />
          <span className="max-sm:hidden">{t.notifTestBtn || "Test"}</span>
        </button>
      )}

      {/* Toast Overlay */}
      {showToast && (
        <div className="fixed bottom-20 right-4 z-50 animate-fade-in p-4 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-xl flex items-center gap-2 text-xs max-w-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500 animate-ping'}`} />
          <span className="font-semibold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
