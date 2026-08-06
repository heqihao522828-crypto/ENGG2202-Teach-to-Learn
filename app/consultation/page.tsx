"use client";

import SiteShell from "../components/site-shell";

const consultationBookingPublicUrl =
  "https://bookings.cloud.microsoft/book/ENGG1101@hkuhk.onmicrosoft.com/?ismsaljsauthenabled";

// Replace this value with the official Microsoft Bookings Embed URL from Bookings admin.
const consultationBookingEmbedUrl =
  process.env.NEXT_PUBLIC_BOOKINGS_EMBED_URL ?? consultationBookingPublicUrl;

export default function ConsultationPage() {
  return (
    <SiteShell>
      <main className="pb-6 pt-2">
        <iframe
          src={consultationBookingEmbedUrl}
          title="ENGG1101 Consultation Booking"
          width="100%"
          height="1000"
          loading="lazy"
          scrolling="yes"
          className="block h-[calc(100vh-92px)] min-h-[900px] w-full"
          style={{ border: 0 }}
        />
      </main>
    </SiteShell>
  );
}
