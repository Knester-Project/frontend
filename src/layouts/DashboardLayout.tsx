//Component
import Nav from "@/components/Nav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-dvh">
            <Nav />
            {children}
        </div>
    );
}

export default DashboardLayout;