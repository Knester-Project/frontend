//Components
import { ThemeToggle } from "@/components/ThemeToggle";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative flex flex-col justify-center items-center min-h-dvh">
            <main className="flex flex-col flex-grow justify-center items-center p-2">
                <div className="top-4 right-4 absolute"><ThemeToggle /></div>
                {children}
            </main>
            <footer className="py-4 font-medium text-center montserrat">
                <p>© {new Date().getFullYear()} <span className="font-bold text-chart-4">KNESTER</span></p>
            </footer>
        </div>
    );
}

export default AuthLayout;