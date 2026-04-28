import type { Preview } from '@storybook/nextjs-vite';
import { Roboto } from "next/font/google";
import '../app/globals.css';

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const preview: Preview = {
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <div className={`font-sans ${roboto.variable} antialiased selection:bg-amber-200 selection:text-amber-900 bg-background text-foreground`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;