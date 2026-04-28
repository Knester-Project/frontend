// Icons
import { Flag } from "iconsax-reactjs";

const CommentFlag = ({ handleFlagging, userFlagged }: { handleFlagging: () => void, userFlagged: boolean }) => {
    return (
        <button disabled={userFlagged} onClick={handleFlagging} title={userFlagged ? "Flagged the comment" : "Flag this comment"}
            className={`flex justify-center items-center 
            ${userFlagged ? "bg-destructive/10 text-destructive cursor-not-allowed"
                    : "bg-white/7 hover:text-destructive  hover:border-destructive hover:bg-destructive/5 border border-border cursor-pointer"} 
                    backdrop-blur-md px-3 py-1.5 rounded-full transition-all duration-500`}>
            <Flag variant={userFlagged ? "Bold" : "Outline"} className="size-3.5 md:size-4 xl:size-5" />
        </button>
    );
}

export default CommentFlag;