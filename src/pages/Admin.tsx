import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Shield, ShieldOff, Crown, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminUser {
  user_id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  subscription_tier: "free" | "premium" | string;
  subscription_status: string;
  created_at: string;
}

interface ConsentLogRow {
  id: string;
  user_id: string | null;
  category: string;
  status: string;
  consent_version: string;
  source: string;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [consentLogs, setConsentLogs] = useState<ConsentLogRow[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Gate: must be logged in + is_admin
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth?redirect=/admin");
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || !data?.is_admin) {
        toast({ title: "Access denied", description: "Admin only.", variant: "destructive" });
        navigate("/");
        return;
      }
      setIsAdmin(true);
      setCheckingAccess(false);
    })();
  }, [user, authLoading, navigate, toast]);

  const fetchUsers = useCallback(
    async (q = "") => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase.functions.invoke("admin-users", {
          body: { action: "list", search: q, limit: 200 },
        });
        if (error) throw error;
        setUsers(data?.users ?? []);
      } catch (err: any) {
        toast({
          title: "Failed to load users",
          description: err.message ?? "Unknown error",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  const fetchConsentLogs = useCallback(async () => {
    setLoadingLogs(true);
    const { data, error } = await supabase
      .from("consent_records")
      .select("id, user_id, category, status, consent_version, source, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (!error) setConsentLogs((data ?? []) as ConsentLogRow[]);
    setLoadingLogs(false);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchConsentLogs();
  }, [isAdmin, fetchConsentLogs]);

  const updateUser = async (
    userId: string,
    updates: Partial<Pick<AdminUser, "is_admin" | "subscription_tier" | "subscription_status">>
  ) => {
    setPendingId(userId);
    try {
      const { error } = await supabase.functions.invoke("admin-users", {
        body: { action: "update", user_id: userId, ...updates },
      });
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, ...updates } : u))
      );
      toast({ title: "Updated", description: "User updated successfully." });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setPendingId(null);
    }
  };

  const togglePremium = (u: AdminUser) => {
    const goingPremium = u.subscription_tier !== "premium";
    updateUser(u.user_id, {
      subscription_tier: goingPremium ? "premium" : "free",
      subscription_status: goingPremium ? "active" : "inactive",
    });
  };

  const toggleAdmin = (u: AdminUser) => {
    updateUser(u.user_id, { is_admin: !u.is_admin });
  };

  if (authLoading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage users, subscriptions, and admin access.
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="consent">Consent audit log</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
        <Card className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers(search)}
                placeholder="Search by email or name..."
                className="pl-9"
                dir="ltr"
              />
            </div>
            <Button onClick={() => fetchUsers(search)} disabled={loadingUsers}>
              {loadingUsers ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Premium</TableHead>
                <TableHead className="text-center">Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingUsers && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin inline" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => {
                  const busy = pendingId === u.user_id;
                  const isPremium = u.subscription_tier === "premium";
                  return (
                    <TableRow key={u.user_id}>
                      <TableCell>
                        <div className="font-medium">{u.email}</div>
                        {u.full_name && (
                          <div className="text-xs text-muted-foreground">{u.full_name}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isPremium ? "default" : "secondary"}>
                          {isPremium && <Crown className="h-3 w-3 mr-1" />}
                          {u.subscription_tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            u.subscription_status === "active" ? "default" : "outline"
                          }
                        >
                          {u.subscription_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={isPremium}
                          disabled={busy}
                          onCheckedChange={() => togglePremium(u)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={u.is_admin}
                            disabled={busy || u.user_id === user?.id}
                            onCheckedChange={() => toggleAdmin(u)}
                          />
                          {u.is_admin ? (
                            <Shield className="h-4 w-4 text-primary" />
                          ) : (
                            <ShieldOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Showing {users.length} user{users.length === 1 ? "" : "s"}. Toggle premium or admin
          status with the switches.
        </p>
          </TabsContent>

          <TabsContent value="consent" className="space-y-4">
            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Version</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingLogs ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
                  ) : consentLogs.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No consent records yet.</TableCell></TableRow>
                  ) : (
                    consentLogs.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-xs whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-xs">{row.user_id ? row.user_id.slice(0, 8) + "…" : "anon"}</TableCell>
                        <TableCell className="capitalize">{row.category.replace("_", " ")}</TableCell>
                        <TableCell><Badge variant={row.status === "granted" ? "default" : "outline"}>{row.status}</Badge></TableCell>
                        <TableCell className="text-xs">{row.source}</TableCell>
                        <TableCell className="text-xs">v{row.consent_version}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
            <p className="text-xs text-muted-foreground text-center">
              Immutable audit log — showing latest {consentLogs.length} records. No sensitive content stored beyond consent text version.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
