import { sileo } from "sileo";

// Services, and Constant
import { useMarkAllNot } from "@/services/userMutations";
import { NOT_LIMIT } from "@/assets/constants";

// UIs
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TickCircle } from "iconsax-reactjs";

// Icons
const notificationTypes = [
    { value: "all", label: "All" },
    { value: "post_like", label: "Post Vibe" },
    { value: "post_comment", label: "Post Comment" },
    { value: "comment_reply", label: "Comment Reply" },
    { value: "reply_reply", label: "Reply to Reply" },
    { value: "comment_like", label: "Comment Vibe" },
    { value: "new_follower", label: "New Circle Member" },
    { value: "follow_request", label: "Circle Request" },
    { value: "follow_request_accepted", label: "Circle Request Accepted" },
    { value: "order_update", label: "Order Update" },
    { value: "system_alert", label: "System Alert" },
    { value: "security_alert", label: "Security Alert" },
];

const Header = ({ type, update }: { type: string, update: (value: string) => void; }) => {

    const updateAll = useMarkAllNot("notification", { limit: NOT_LIMIT });
    const handleUpdateAll = () => {
        sileo.info({ title: "Updating All !!!" });

        updateAll.mutate({
            onSuccess: () => {
                sileo.success({ title: "Marked all as read !!!" });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Couldn't update notifications now, kindly try again later.";
                sileo.error({ title: "Error", description: message });
            },
        });
    }

    return (
        <main className="flex justify-between items-center shadow px-[1rem] sm:px-8 md:px-[3rem] lg:px-[4rem] 2xl:px-[6rem] xl:px-[5rem] py-2 border-border border-b">
            <section className="flex items-center gap-x-5">
                <h1 className="font-semibold text-sm md:text-base xl:text-lg">Notifications</h1>
                <div className="bg-border w-0.5 h-7"></div>
                <Select onValueChange={update}>
                    <SelectTrigger className="bg-primary/10 border-border w-full text-[11px] text-primary-foreground md:text-xs xl:text-sm">
                        <SelectValue placeholder={`Filter: ${type}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {notificationTypes.map((not) => (
                            <SelectItem value={not.value}>{not.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </section>
            <button aria-label="Mark all as read" className="border-none outline-none font-semibold hover:text-primary duration-200 cursor-pointer" onClick={handleUpdateAll}>
                <span className="hidden sm:inline">Mark all as read</span> <TickCircle className="inline mb-0.5 size-5" />
            </button>
        </main>
    );
}

export default Header;