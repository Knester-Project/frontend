import { Link } from "@tanstack/react-router";

// UIs
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Utils
import { truncate } from "@/utils/format";

// Icons
import { GlobalEdit, MessageText1 } from "iconsax-reactjs";

const PeopleAround = () => {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-x-1">
                <GlobalEdit className="size-5 text-primary" variant="Bold" />
                <p className="font-semibold">People Around</p>
            </div>
            <section className="flex justify-between items-center">
                <section className="flex items-center gap-x-2">
                    <Link to="/profile" search={{ profile: "food" }}>
                        <Avatar className="rounded-full">
                            <AvatarImage src="https://github.com/evilrabbit.png" alt="default profile" />
                            <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className="flex flex-col">
                        <p className="font-bold text-xs xl:text-sm montserrat">Sam Wilson</p>
                        <p className="text-xs xl:text-sm">
                            {truncate("I don't give a fuck about people, just so you know", 20)}
                        </p>
                    </div>
                </section>
                <Link to="/messages">
                    <Button className="bg-primary hover:bg-inherit border hover:border-primary hover:text-primary duration-300">
                        <MessageText1 className="inline size-4" variant="Bold" /> Chat
                    </Button>
                </Link>
            </section>
        </Card>
    );
}

export default PeopleAround;