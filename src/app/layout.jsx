import "./globals.css";
import "../lib/fontawesome";
import { UserProvider } from "@/context/usercontext";
import Header from "@/components/client/header";
import Footer from "@/components/server/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR">
      <UserProvider>
        <body>
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </UserProvider>
    </html>
  );
}
