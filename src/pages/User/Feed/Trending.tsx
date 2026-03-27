// UIs
import { Card } from "@/components/ui/card";

// Utils
import { formatTrendingCount } from "@/utils/format";

// Icons
import { Hash, Flame } from 'lucide-react';

const Trending = () => {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-x-1">
                <Flame className="fill-primary size-5 text-primary animate-bounce" />
                <p className="font-semibold">Trending Hashtags</p>
            </div>
            <section>
                <div className="p-4 rounded-2xl transition-colors duration-200 cursor-pointer">
                    <h3 className="mb-1 font-semibold"><Hash className="inline mb-1 size-4 text-primary" />NewMusicFriday</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm montserrat">{formatTrendingCount(120000)} posts</p>
                </div>
            </section>
        </Card>
    );
}

export default Trending;