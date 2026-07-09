// UIs
import ComingSoon from "@/components/ComingSoon";

// Icons
import { Microscope } from "iconsax-reactjs";

// Icons

const index = () => {

    const launchDate = new Date(2026, 7, 30);

    return (
        <main className="p-4">
            <ComingSoon
                launchDate={launchDate}
                Icon={Microscope}
                title="Market Place"
                description="A curated marketplace for everyday finds, deals, steals, and one-of-a-kind finds."
            />
        </main>
    );
}

export default index;