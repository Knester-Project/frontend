// UIs
import { Card } from "@/components/ui/card";
import { Messages3 } from "iconsax-reactjs";

const Messages = () => {
    return (
        <Card className="p-4">
            <header>
                <div className="flex items-center gap-x-2">
                    <Messages3 className="size-5 text-primary" />
                    <p className="font-semibold text-base">Catch Up With People</p>
                </div>
            </header>
        </Card>
    );
}

export default Messages;