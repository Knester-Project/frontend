// Hooks and Utils
import { useMessageSearch } from "@/Hooks/chats/useMessageSearch";
import { cn } from "@/lib/utils";

// Icons
import { ArrowLeft2 } from "iconsax-reactjs";

const SearchMessage = ({ toggleSearch, conversationId, onMessageClick }: { toggleSearch: () => void, conversationId: string | null, onMessageClick: (messageId: string) => void; }) => {

    const { searchMessages, searchResults, isSearching, clearSearch } = useMessageSearch(conversationId);

    if (!conversationId) return

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        if (text.length > 2) {
            searchMessages(text);
        } else if (text.length === 0) {
            clearSearch();
        }
    };

    return (
        <main className="px-2 py-1">

            <section className="flex items-center gap-x-2">
                <button onClick={toggleSearch}
                    className="hover:bg-primary/10 p-1.5 rounded-full transition-colors cursor-pointer"
                    aria-label="Back">
                    <ArrowLeft2 className="size-4 md:size-4.5 xl:size-5 text-muted-foreground" />
                </button>
                <input type="text" placeholder="Search for Messages" autoFocus={true}
                    className={cn("px-4 py-2 border border-border focus:border-primary rounded-lg focus:outline-none w-full",
                        "placeholder:text-[11px] md:placeholder:text-xs xl:placeholder:text-sm duration-300 focus:caret-primary")}
                    onChange={handleInput}
                />
            </section>
            <section className="mt-4">
                {isSearching && <p className="smallText">Searching securely...</p>}

                <ul className="space-y-1 max-h-60 hide-scrollbar">
                    {searchResults.map((msg) => (
                        <li
                            key={msg.id}
                            onClick={() => onMessageClick(msg.id)}
                            className="bg-primary/10 hover:bg-primary/20 p-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <p className="smallText">{msg.decryptedContent}</p>

                            <span className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs montserrat">
                                {new Intl.DateTimeFormat('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                }).format(new Date(msg.createdAt))}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

export default SearchMessage;