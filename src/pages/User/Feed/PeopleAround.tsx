import { Link } from "@tanstack/react-router";

// UI
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Icons
import { GlobalEdit, MessageText1 } from "iconsax-reactjs";

const PeopleAround = () => {
    return (
        <Card className="space-y-4 p-4">
            <div className="flex items-center gap-2">
                <GlobalEdit className="size-6 text-primary" />
                <p className="font-semibold">People Around</p>
            </div>

            <div className="flex justify-between items-center gap-3">
                <div className="flex flex-1 items-center gap-3 min-w-0">
                    <Link to="/profile" search={{ profile: "food" }} className="shrink-0">
                        <Avatar>
                            <AvatarImage src="/default.svg" alt="default profile" />
                            <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                    </Link>

                    <div className="flex flex-col min-w-0">
                        <p className="font-bold text-xs xl:text-sm montserrat">
                            Sam Wilson
                        </p>

                        <p className="text-[11px] text-gray-600 dark:text-gray-400 xl:text-xs line-clamp-2 leading-snug">
                            I don't give a f*** about people, just so you know
                        </p>
                    </div>
                </div>

                <div className="shrink-0">
                    <Link to="/messages" search={{ username: "" }}>
                        <Button size="sm" className="bg-primary hover:bg-transparent border border-transparent hover:border-primary hover:text-primary transition-all duration-300">
                            <MessageText1 className="size-4" variant="Bold" />
                            <span className="ml-0.5 text-xs xl:text-sm">Chat</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default PeopleAround;