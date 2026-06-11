import { HomePage } from "@/components/HomePage";
import { site } from "@/lib/site";

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Catedral Experience – Recomeços",
  description:
    "Tributo beneficente independente ao repertório da Banda Catedral, com música, propósito e impacto social em São Paulo.",
  startDate: site.eventDateIso,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  image: [`${site.url}/assets/hero-concert.jpg`],
  url: site.url,
  location: {
    "@type": "Place",
    name: site.address.venue,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.street}, ${site.address.floor}`,
      addressLocality: "São Paulo",
      addressRegion: "SP",
      addressCountry: "BR",
      addressNeighborhood: site.address.district
    }
  },
  organizer: {
    "@type": "Organization",
    name: "Catedral Experience – Recomeços",
    url: site.url
  },
  offers: [
    {
      "@type": "Offer",
      name: "Ingresso Recomeços",
      price: "100.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: site.symplaUrl
    },
    {
      "@type": "Offer",
      name: "Ingresso Juntos",
      price: "70.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: site.symplaUrl
    },
    {
      "@type": "Offer",
      name: "Ingresso Pela Causa",
      price: "150.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/LimitedAvailability",
      url: site.url
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <HomePage />
    </>
  );
}
