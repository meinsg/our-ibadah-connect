import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ListPayload {
  action: "list";
  search?: string;
  limit?: number;
  offset?: number;
}

interface UpdatePayload {
  action: "update";
  user_id: string;
  is_admin?: boolean;
  subscription_tier?: "free" | "premium";
  subscription_status?: "inactive" | "active" | "canceled";
}

type Payload = ListPayload | UpdatePayload;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Verify caller is admin
    const { data: callerProfile, error: profErr } = await admin
      .from("profiles")
      .select("is_admin")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (profErr || !callerProfile?.is_admin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Payload;

    if (body.action === "list") {
      const search = (body.search ?? "").trim().toLowerCase();
      const limit = Math.min(body.limit ?? 100, 500);

      // Page through auth users (admin API limited to 1000/page; fine for now)
      const { data: usersList, error: listErr } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (listErr) throw listErr;

      const userIds = usersList.users.map((u) => u.id);
      const { data: profiles } = await admin
        .from("profiles")
        .select("user_id, full_name, is_admin, subscription_tier, subscription_status, created_at")
        .in("user_id", userIds);

      const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

      let merged = usersList.users.map((u) => {
        const p = profileMap.get(u.id);
        return {
          user_id: u.id,
          email: u.email ?? "",
          full_name: p?.full_name ?? null,
          is_admin: p?.is_admin ?? false,
          subscription_tier: p?.subscription_tier ?? "free",
          subscription_status: p?.subscription_status ?? "inactive",
          created_at: u.created_at,
        };
      });

      if (search) {
        merged = merged.filter(
          (u) =>
            u.email.toLowerCase().includes(search) ||
            (u.full_name ?? "").toLowerCase().includes(search)
        );
      }

      merged.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

      return new Response(
        JSON.stringify({ users: merged.slice(0, limit), total: merged.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.action === "update") {
      if (!body.user_id) {
        return new Response(JSON.stringify({ error: "user_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = {};
      if (typeof body.is_admin === "boolean") updates.is_admin = body.is_admin;
      if (body.subscription_tier) updates.subscription_tier = body.subscription_tier;
      if (body.subscription_status) updates.subscription_status = body.subscription_status;

      if (Object.keys(updates).length === 0) {
        return new Response(JSON.stringify({ error: "No fields to update" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Prevent self-demotion (avoid lockout)
      if (body.user_id === userData.user.id && updates.is_admin === false) {
        return new Response(
          JSON.stringify({ error: "Cannot remove your own admin status" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: updErr } = await admin
        .from("profiles")
        .update(updates)
        .eq("user_id", body.user_id);

      if (updErr) throw updErr;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-users error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
