import './globals.css';

export const metadata = {
  title: 'CF Practice Ladder',
  description: 'Find Codeforces problems solved by an expert and track your own progress.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
