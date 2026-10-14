import { createFileRoute } from "@tanstack/react-router";
import { DesignSamples } from '@/components/design-samples';
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Rohit Samaj — Three New Design Directions' },
    { name: 'description', content: 'Explore three fresh designs for Rohit Samaj, the local business directory connecting communities in India and the UK.' },
    { property: 'og:title', content: 'Rohit Samaj — Discover Your Community' },
    { property: 'og:description', content: 'Compare Local & Natural, Bold & Editorial, and Clean & Modern website designs for Rohit Samaj.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: DesignSamples,
});
