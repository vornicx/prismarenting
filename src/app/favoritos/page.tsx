import Header from "@/components/Header";
import FavoritesClient from "@/components/FavoritesClient";

export default function FavoritesPage() {
  return (
    <main className="favorites-shell">
      <div className="favorites-header-wrap"><Header theme="dark" /></div>
      <FavoritesClient />
    </main>
  );
}
