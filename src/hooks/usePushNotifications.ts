import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// VAPID public key (safe to expose - it's a public key)
const VAPID_PUBLIC_KEY = 'BJKRS3jZCuPbUNjbRI71rhUmpXAlfxyE8ZI9RkqN6qcKyXqk7bCh574VYzcyegLT4-i5MlS_W681OIMS13VM3lI';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        setSwRegistration(reg);
        // Check if already subscribed
      (reg as any).pushManager.getSubscription().then((sub: any) => {
          setIsSubscribed(!!sub);
        });
      }).catch((err: any) => {
        console.error('SW registration failed:', err);
      });
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!user || !swRegistration || !VAPID_PUBLIC_KEY) return;

    setIsLoading(true);
    try {
      // Request permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        toast.error('Notification permission denied. Please enable it in browser settings.');
        setIsLoading(false);
        return;
      }

      const subscription = await (swRegistration as any).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJson = subscription.toJSON();

      // Save to database - delete existing then insert to avoid unique constraint issues
      await supabase.from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('endpoint', subJson.endpoint as string);

      const { error } = await supabase.from('push_subscriptions').insert({
        user_id: user.id,
        endpoint: subJson.endpoint as string,
        p256dh: subJson.keys?.p256dh || '',
        auth: subJson.keys?.auth || '',
      });

      if (error) throw error;

      setIsSubscribed(true);
      toast.success('🔔 Push notifications enabled! You\'ll receive alerts even when the tab is closed.');
    } catch (err: any) {
      console.error('Push subscription failed:', err);
      toast.error('Failed to enable push notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [user, swRegistration]);

  const unsubscribe = useCallback(async () => {
    if (!swRegistration || !user) return;

    try {
      const subscription = await (swRegistration as any).pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Remove from database
        await supabase.from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', subscription.endpoint);
      }
      setIsSubscribed(false);
      toast.success('Push notifications disabled.');
    } catch (err) {
      console.error('Unsubscribe failed:', err);
    }
  }, [swRegistration, user]);

  return {
    permission,
    isSubscribed,
    isLoading,
    isSupported: 'serviceWorker' in navigator && 'PushManager' in window,
    subscribe,
    unsubscribe,
  };
}
