import "./globals.css";
import "../lib/fontawesome";
import { UserProvider } from "@/context/usercontext";
import { CartProvider } from "@/context/cartcontext";
import Header from "@/components/client/header";
import Footer from "@/components/server/footer";

export const metadata = {
  icons: "/image/favicon.png",
  title: "پرواز دیجیتال | فروشگاه اینترنتی موبایل و لپ تاپ",
  description:
    "پرواز دیجیتال، فروشگاه اینترنتی تخصصی موبایل و لپ تاپ؛ عرضه جدید ترین گوشی ها و لپ تاپ های روز دنیا با قیمت رقابتی، ارسال سریع و پشتیبانی مطمئن.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa-IR">
      <body>
        <UserProvider>
          <CartProvider>
            <Header />
            <main className="sm:pt-[156px]">{children}</main>
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
