import "./globals.css";
import "../lib/fontawesome";
import { UserProvider } from "@/context/usercontext";
import { CartProvider } from "@/context/cartcontext";
import Header from "@/components/client/header";
import Footer from "@/components/server/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR">
      <body>
        <UserProvider>
          <CartProvider>
            <Header />
            <main className="pt-[156px]">{children}</main>
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
