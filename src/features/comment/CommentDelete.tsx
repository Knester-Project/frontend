// Icons
import { Trash } from "iconsax-reactjs";

const CommentDelete = ({ handleDeletion, userDeleted }: { handleDeletion: () => void, userDeleted: boolean }) => {
    return (
        <button disabled={userDeleted} onClick={handleDeletion} title="Flag this comment"
            className={`flex justify-center items-center 
            ${userDeleted ? "bg-destructive/10 text-destructive cursor-not-allowed"
                    : "bg-white/7 hover:text-destructive hover:border-destructive hover:bg-destructive/5 border border-border cursor-pointer"} 
                    backdrop-blur-md px-3 py-1.5 rounded-full transition-all duration-200`}>
            <Trash variant={userDeleted ? "Bold" : "Outline"} className="size-4" />
        </button>
    );
}

export default CommentDelete;