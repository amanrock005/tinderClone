import { useAuthStore } from "../store/useAuthStore";

export default function HomePage() {
  const { logout } = useAuthStore();
  return (
    <div>
      this is homepage
      <button onClick={logout}>logout</button>
    </div>
  );
}
