import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default async function NewGalleryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Add Image</h1>
      <p className="text-sm text-[#a0a0a0] mb-6">Upload a new image to the gallery.</p>
      <GalleryForm />
    </div>
  );
}
