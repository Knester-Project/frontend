// Icons
import { NotificationBing } from "iconsax-reactjs";

const Empty = () => {
    return (
        <main className="flex flex-col justify-center items-center gap-y-3 h-[85vh]">
            <NotificationBing className="size-12 md:size-14 xl:size-16 text-primary" variant="Bold" />
            <div className="text-center">
                <h2 className="font-semibold text-lg md:text-xl xl:text-2xl">All Caught Up!</h2>
                <p className="text-foreground/70">No new notifications, adjust your filter and try again.</p>
            </div>
        </main>
    );
}

export default Empty;