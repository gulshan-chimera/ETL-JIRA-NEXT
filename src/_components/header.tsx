import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { NavigationMenu } from "@radix-ui/react-navigation-menu";
import { axiosInstance as axios } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useFetch } from "@/lib/hooks/useFetch";

export function Header() {
  const { data: userData, loading: userLoading } = useFetch<{
    user: { name: string };
  } | null>({ url: "/auth/profile", defaultState: null });
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      router.push("/");
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };

  if (userLoading) {
    return <div>User Loading...</div>;
  }

  if (!userData?.user) {
    router.push("/");
    return null;
  }

  return (
    <>
      <header className="w-full h-14 flex items-center justify-between px-6 bg-white border-b shadow-sm">
        <div className="text-xl font-semibold">Chart</div>
        <NavigationMenu />
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleLogout}>
            Log Out
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarImage src="/me.png" alt="user" />
            <AvatarFallback>
              {userData.user.name.charAt(0)?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <p className="mt-4">Welcome, {userData.user.name}!</p>
    </>
  );
}
