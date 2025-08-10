//Components
import { ThemeToggle } from "@/components/ThemeToggle";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative flex flex-col justify-center items-center min-h-dvh">
            <main className="flex flex-col flex-grow justify-center items-center">
                <div className="top-4 right-4 absolute"><ThemeToggle /></div>
                {children}
            </main>
            <footer className="bg-background py-4 text-foreground text-center">
                <p>© 2025 <span className="text-primary">KNESTER</span></p>
            </footer>
        </div>
    );
}

export default AuthLayout;