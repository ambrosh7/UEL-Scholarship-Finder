import { Suspense } from "react";
import { ParentScreen } from "@/components/screens/ParentScreen";
import { PhoneShell } from "@/components/layout/PhoneShell";

export default function ParentPage({ params }: PageProps<"/p/[id]">) {
  return (
    <Suspense
      fallback={
        <PhoneShell>
          <p className="px-5 py-10 text-base text-muted">Loading…</p>
        </PhoneShell>
      }
    >
      <ParentPageInner params={params} />
    </Suspense>
  );
}

async function ParentPageInner({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ParentScreen id={id} />;
}
