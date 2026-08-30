// UIs
import ComingSoon from "@/components/common/ComingSoon";

// Icons
import { EmojiHappy } from "iconsax-reactjs";

// Icons

const index = () => {

    const launchDate = new Date(2026, 7, 30);

    return (
        <main className="mx-auto p-4 w-full max-w-screen-2xl">
            <ComingSoon
                launchDate={launchDate}
                Icon={EmojiHappy}
                title="Market Place"
                description="A curated marketplace for everyday finds, deals, steals, and one-of-a-kind finds."
            />
        </main>
    );
}

export default index;