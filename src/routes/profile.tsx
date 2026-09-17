import { createFileRoute } from '@tanstack/react-router';
import Profile from '@/pages/Profile';

export const Route = createFileRoute('/profile')({
  component: Profile,
  head: () => ({
    meta: [
      { title: 'Your profile — CULT FUN' },
      { name: 'description', content: 'Set your handle, picture and bio, link wallets, and choose whether your holdings show on cult pages.' },
      { property: 'og:title', content: 'Your profile — CULT FUN' },
      { property: 'og:description', content: 'Set your handle, picture and bio, link wallets, and choose whether your holdings show on cult pages.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});
