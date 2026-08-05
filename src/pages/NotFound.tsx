import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SeoHead from "@/components/SeoHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SeoHead
        title="Sidan hittades inte (404) – Noll Ettan"
        description="Sidan du letade efter finns inte. Gå tillbaka till startsidan för lunch och catering hos Noll Ettan."
        path={location.pathname}
        noindex
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Sidan hittades inte</p>
        <a href="/" className="text-primary underline">
          Till startsidan
        </a>
      </div>
    </div>
  );
};

export default NotFound;
