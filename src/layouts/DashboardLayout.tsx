//Component
import Nav from "@/components/Nav";
import InstallBtn from "@/components/InstallBtn";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-dvh">
            <Nav />
            <InstallBtn />
            {children}
        </div>
    );
}

export default DashboardLayout;