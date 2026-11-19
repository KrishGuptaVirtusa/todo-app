import "./globals.css";

export const metadata = {
  title: "Taskly | Your productivity space",
  description: "A modern personal task management workspace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}