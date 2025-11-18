import { Link } from "@tanstack/react-router";

//Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

//Utils
import { truncate } from "@/utils/format";

//Icons
import { MessageText1 } from "iconsax-reactjs";

const PeopleAround = () => {
    return (
        <main className="gap-x-2 bg-card p-4 border border-border rounded-2xl text-card-foreground">
            <p className="font-semibold">People Around</p>
            <section className="flex justify-between items-center mt-4">
                <Link to="/profile" search={{ profile: "food" }}>
                    <Avatar className="rounded-full">
                        <AvatarImage src="https://github.com/evilrabbit.png" alt="default profile" />
                        <AvatarFallback>KN</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex flex-col">
                    <p className="font-bold text-xs xl:text-sm montserrat">Sam Wilson</p>
                    <p className="text-xs xl:text-sm">
                        {truncate("I don't give a fuck about people, just so you know", 20)}
                    </p>
                </div>
                <Link to="/messages">
                    <Button className="bg-accent hover:bg-inherit border hover:border-accent hover:text-accent duration-300">Chat <MessageText1 className="inline size-4" /></Button>
                </Link>
            </section>
        </main>
    );
}

export default PeopleAround;