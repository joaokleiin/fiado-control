import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getMerchantProfile } from "@/lib/data";
import { SettingsPageClient } from "@/components/settings/settings-page-client";

export default async function SettingsPage() {
  const merchant = await getMerchantProfile();

  let email = "usuario@fiadocontrol.com";
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? email;
  }

  return <SettingsPageClient merchant={merchant} email={email} />;
}
