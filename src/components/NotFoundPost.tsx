// Icons
import { SearchNormal1, AddCircle } from "iconsax-reactjs";

const NoPostsFound = ({ onReset, title, text }: { onReset?: () => void, title: string, text: string }) => {
    return (
        <div className="flex flex-col justify-center items-center bg-accent/10 dark:bg-accent/5 backdrop-blur-sm mt-10 p-10 border border-border rounded-3xl text-center">
            <div className="bg-white/20 dark:bg-white/5 mb-4 p-4 border border-white/20 rounded-full">
                <SearchNormal1 className="size-8 md:size-9 xl:size-10 text-gray-400" />
            </div>
            <h3 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">{title}</h3>
            <p className="mb-6 max-w-xs text-gray-400">
                {text}
            </p>

            {onReset && (
                <button onClick={onReset}
                    className="flex items-center gap-2 bg-white/40 hover:bg-white/60 dark:bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20 rounded-xl font-medium transition-all" >
                    <AddCircle className="size-5" />
                    Create New Post
                </button>
            )}
        </div>
    );
};

export default NoPostsFound;