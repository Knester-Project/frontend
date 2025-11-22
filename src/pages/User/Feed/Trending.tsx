//Components
import { Card } from "@/components/ui/card";

//Utils
import { formatTrendingCount } from "@/utils/format";

//Icons
import { HuobiToken } from "iconsax-reactjs";

const Trending = () => {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-x-1">
                <HuobiToken className="size-5 text-primary" variant="Bold" />
                <p className="font-semibold">Trending</p>
            </div>
            <section>
                <div className="p-4 rounded-2xl transition-colors duration-200 cursor-pointer">
                    <h3 className="mb-1 font-semibold"><span className="text-primary">#</span>NewMusicFriday</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{formatTrendingCount(120000)} posts</p>
                </div>
            </section>
        </Card>
    );
}

export default Trending;