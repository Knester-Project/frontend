import { cn } from "@/lib/utils";

interface MainProps {
    children: React.ReactNode;
    classNames?: string;
}

const Main = ({ children, classNames }: MainProps) => {
    return (
        <main
            className={cn("px-4 sm:px-6 lg:px-8 2xl:px-12 xl:px-10 py-6 w-full", classNames)}>
            {children}
        </main>
    );
};

export default Main;