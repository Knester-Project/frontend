import { useSuspenseQuery } from "@tanstack/react-query";

// Services
import { allConversationsOptions } from "@/services/userQueries";

const Index = () => {

    const { data } = useSuspenseQuery(allConversationsOptions());
    const conversationsData: ConversationsData = data;
    console.log("The conversation data", data)

    return (
        <main>

        </main>
    );
}

export default Index;