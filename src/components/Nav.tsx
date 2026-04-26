import { useState } from "react";
import { useLocation, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

// Libs and Stores
import { cn } from "@/lib/utils";
import { meStore } from "@/stores/me.store";

// UIs
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

//Logo
import logo from "/logo.svg";

//Icons
import { Search, Menu, X } from "lucide-react";
import { Home, Video, Profile2User, Message, Notification, SearchNormal, SecuritySafe } from "iconsax-reactjs";


const Nav = () => {

    const user = meStore((state) => state.user);
    const loc = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const navigationItems = [
        { href: "/feed", icon: Home, label: "Feed" },
        { href: "/videos", icon: Video, label: "Videos" },
        { href: "/people", icon: Profile2User, label: "People" },
        { href: "/messages", icon: Message, label: "Messages" },
        { href: "/safety", icon: SecuritySafe, label: "Safety" }
    ]

    return (
        <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-md border-border border-b">
            <div className="px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem] py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Link to="/feed" className="shrink-0">
                            <img src={logo} alt="Knester Logo" className="mr-2 rounded-[50%] size-8" />
                        </Link>

                        <nav className="hidden lg:flex items-center gap-4">
                            {navigationItems.map((item) => {
                                const Icon = item.icon
                                const isActive = loc.href === item.href

                                return (
                                    <Link key={item.href} to={item.href}>
                                        <Button variant="ghost" size="sm" className={cn("gap-2 transition-colors", isActive && "bg-primary text-primary-foreground")}>
                                            <Icon className="size-4" variant={isActive ? "Bold" : "Outline"} />
                                            {item.label}
                                        </Button>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Search and Actions */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="hidden sm:block">
                            <Link to="/search">
                                <SearchNormal className="size-4" />
                            </Link>
                        </Button>

                        {/* Notifications */}
                        <Button variant="ghost" size="sm" className="relative">
                            <Notification />
                            <span className="-top-1 -right-1 absolute bg-red-500 px-1 pb-[1px] rounded-full text-white text-xs">0</span>
                        </Button>

                        {/* Profile */}
                        <Link to="/profile" search={{ profile: "me" }}>
                            <Avatar className="size-8! cursor-pointer">
                                <AvatarImage src={user?.profile?.profilePicture || "/default.svg"} />
                                <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                        </Link>

                        {/* Mobile Menu Button */}
                        <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div key="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="lg:hidden top-10 left-0 z-10 absolute bg-white dark:bg-black mt-4 p-4 w-full">
                            <nav className="flex flex-col gap-2 mt-4">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon
                                    const isActive = loc.href === item.href

                                    return (
                                        <motion.div key={item.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                                            <Link to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                                <Button variant="ghost" size="sm"
                                                    className={cn("justify-start gap-2 w-full", isActive && "bg-primary text-primary-foreground")}>
                                                    <Icon className="size-4" variant={isActive ? "Bold" : "Outline"} />
                                                    {item.label}
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    )
                                })}

                                {/* Mobile Search */}
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.2, delay: 0.1 }} className="relative mt-2">
                                    <Search className="top-1/2 left-3 absolute size-4 -translate-y-1/2 transform" />
                                    <Input placeholder="Search Knester..." className="pl-10" />
                                </motion.div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}

export default Nav;