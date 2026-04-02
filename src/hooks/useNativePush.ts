import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Capacitor } from '@capacitor/core';

/**
 * Handles native Capacitor push notifications on Android/iOS.
 * Registers for push, saves FCM token to DB, and handles foreground notifications.
 */
export function useNativePush() {
  const { user } = useAuth();
  const registered = useRef(false);

  useEffect(() => {
    if (!user || !Capacitor.isNativePlatform() || registered.current) return;

    let cleanup: (() => void) | undefined;

    const init = async () => {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');
        const { LocalNotifications } = await import('@capacitor/local-notifications');

        // Request permission
        const permResult = await PushNotifications.requestPermissions();
        if (permResult.receive !== 'granted') {
          console.warn('Push notification permission denied');
          return;
        }

        // Register for push
        await PushNotifications.register();
        registered.current = true;

        // Token received — save to DB
        const tokenListener = await PushNotifications.addListener('registration', async (token) => {
          console.log('Native push token:', token.value);
          try {
            const { data: existing } = await supabase
              .from('fcm_tokens' as any)
              .select('id')
              .eq('user_id', user.id)
              .eq('token', token.value)
              .maybeSingle();

            if (!existing) {
              await supabase.from('fcm_tokens' as any).insert({
                user_id: user.id,
                token: token.value,
                device_info: `capacitor-${Capacitor.getPlatform()}`,
              });
              console.log('Native FCM token saved');
            }
          } catch (err) {
            console.error('Failed to save native FCM token:', err);
          }
        });

        // Registration error
        const errorListener = await PushNotifications.addListener('registrationError', (err) => {
          console.error('Push registration error:', err);
        });

        // Foreground notification — show as local notification
        const foregroundListener = await PushNotifications.addListener(
          'pushNotificationReceived',
          async (notification) => {
            console.log('Foreground push received:', notification);
            try {
              await LocalNotifications.schedule({
                notifications: [{
                  title: notification.title || 'HDC Portal',
                  body: notification.body || 'New notification',
                  id: Date.now(),
                  schedule: { at: new Date(Date.now() + 100) },
                  sound: 'default',
                  extra: notification.data,
                }],
              });
            } catch (e) {
              console.error('Local notification error:', e);
            }
          }
        );

        // Notification tapped — navigate
        const tapListener = await PushNotifications.addListener(
          'pushNotificationActionPerformed',
          (action) => {
            const url = action.notification.data?.url;
            if (url) {
              window.location.href = url;
            }
          }
        );

        cleanup = () => {
          tokenListener.remove();
          errorListener.remove();
          foregroundListener.remove();
          tapListener.remove();
        };
      } catch (err) {
        console.error('Native push init error:', err);
      }
    };

    init();

    return () => {
      cleanup?.();
    };
  }, [user]);
}
