import { Link } from "@tanstack/react-router";
import { LoginCurve } from "iconsax-reactjs";

export default function Index() {
    return (
        <div className="flex flex-col justify-center items-center gap-4 px-4 min-h-dvh text-center">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl xl:text-6xl montserrat">
                404
            </h1>

            <div className="space-y-2">
                <h2 className="font-semibold text-lg md:text-xl xl:text-2xl">
                    Page Not Found
                </h2>

                <p className="max-w-md text-foreground/70">
                    The page you are looking for does not exist or may have been moved.
                </p>
            </div>

            <Link to="/login" className="bg-primary hover:bg-primary/90 px-6 py-2 rounded-md text-primary-foreground transition-colors">
                Login <LoginCurve className="inline size-4 md:size-4.5 xl:size-5" />
            </Link>
        </div>
    );
}
