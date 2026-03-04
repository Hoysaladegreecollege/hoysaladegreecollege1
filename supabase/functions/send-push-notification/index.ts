import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    
    if (!vapidPublicKey || !vapidPrivateKey) {
      return new Response(
        JSON.stringify({ error: 'VAPID keys not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    webpush.setVapidDetails(
      'mailto:pavanaofficial05@gmail.com',
      vapidPublicKey,
      vapidPrivateKey
    );

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify caller is staff
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
      // Check role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      if (!roleData || !['teacher', 'admin', 'principal'].includes(roleData.role)) {
        return new Response(JSON.stringify({ error: 'Only staff can send push notifications' }), { 
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }
    }

    // notifications: array of { user_id, title, body, url, tag }
    const { notifications } = await req.json();
    
    if (!notifications || !Array.isArray(notifications) || notifications.length === 0) {
      return new Response(
        JSON.stringify({ error: 'notifications array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all unique user_ids
    const userIds = [...new Set(notifications.map((n: any) => n.user_id))];
    
    // Fetch subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, message: 'No push subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Group subscriptions by user_id
    const subsByUser: Record<string, any[]> = {};
    for (const sub of subscriptions) {
      if (!subsByUser[sub.user_id]) subsByUser[sub.user_id] = [];
      subsByUser[sub.user_id].push(sub);
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const notif of notifications) {
      const userSubs = subsByUser[notif.user_id] || [];
      for (const sub of userSubs) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth }
            },
            JSON.stringify({
              title: notif.title || 'HDC Portal',
              body: notif.body || 'New notification',
              url: notif.url || '/dashboard/student',
              tag: notif.tag || 'hdc-' + Date.now(),
            })
          );
          sentCount++;
        } catch (err: any) {
          failedCount++;
          // Remove expired subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ sent: sentCount, failed: failedCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
