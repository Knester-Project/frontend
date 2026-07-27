// Services
import { allConversationsOptions } from "@/services/userQueries";

// UIs
import { Card } from "@/components/ui/card";
import { Messages3 } from "iconsax-reactjs";

const Messages = () => {

    const { data, isLoading, isError, refetch } = allConversationsOptions({ offset: 0, limit: 5 });
    console.log("The data", data);

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