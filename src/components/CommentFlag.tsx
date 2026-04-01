// Icons
import { Flag } from "iconsax-reactjs";

const CommentFlag = ({ handleFlagging, userFlagged }: { handleFlagging: () => void, userFlagged: boolean }) => {
    return (
        <button disabled={userFlagged} onClick={handleFlagging} title="Flag this comment"
            className={`flex justify-center items-center 
            ${userFlagged ? "bg-destructive/10 text-destructive cursor-not-allowed"
                    : "bg-white/7 hover:text-destructive  hover:border-destructive hover:bg-destructive/5 border border-border cursor-pointer"} 
                    backdrop-blur-md px-3 py-1.5 rounded-full transition-all duration-200`}>
            <Flag variant={userFlagged ? "Bold" : "Outline"} className="size-4" />
        </button>
    );
}

export default CommentFlag;