import { createFileRoute } from '@tanstack/react-router';

const SERVER_URL =
  process.env.NODE_ENV === 'production' ? 'https://hooks.navfixture.dev' : 'https://hooks.staging.navfixture.dev';

export const Route = createFileRoute('/settings')({ component: Settings });

function Settings() {
  // The install flow lives on another app's host: the browser leaves for it.
  const install = (token: string) => {
    window.location.href = `${SERVER_URL}/slack/install?token=${token}`;
  };
  return <button onClick={() => install('t')}>Add to Slack</button>;
}
