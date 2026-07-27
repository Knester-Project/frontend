import { useSuspenseQuery } from "@tanstack/react-query";

// Services
import { allConversationsOptions } from "@/services/userQueries";

const Index = () => {

    const { data } = useSuspenseQuery(allConversationsOptions());
    const conversationsData: ConversationsData = data;

    return (
        <main>

        </main>
    );
}

export default Index;