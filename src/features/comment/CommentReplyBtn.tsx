// Icons
import { CloseSquare, Messages2 } from "iconsax-reactjs";

const CommentReplyBtn = ({ toggleForm, replyForm, replies }: { toggleForm: () => void; replyForm: boolean, replies: number }) => {
    return (
        <button onClick={(toggleForm)}
            className={`flex items-center gap-1.5 bg-white/7 rounded-full cursor-pointer border border-border hover:bg-comment-active/5 hover:border-comment-active backdrop-blur-md px-3 py-1.5 hover:text-comment-active transition-all duration-200`}>
            {replyForm ? <CloseSquare className="size-4 text-destructive" variant="Bold" /> : <Messages2 className="size-3.5 md:size-4 xl:size-5" />}
            <span className="font-medium montserrat">{replies}</span>
        </button>
    );
}

export default CommentReplyBtn;