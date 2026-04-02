import { useState } from "react";

// UIs
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Icons
import { Image, Video } from "iconsax-reactjs";
import { CircleCheckBig, Loader } from "lucide-react";


export default function CreatePost() {

    const [content, setContent] = useState<string>("")
    const [isPosting, setIsPosting] = useState(false)

    const handlePost = async () => {

        if (!content.trim()) return;

        setIsPosting(true)
    }

    const characterLimit = import.meta.env.VITE_POST_LENGTH;
    const remainingChars = characterLimit - content.length

    return (
        <Card className="px-4">
            <section className="flex gap-x-2">
                <Avatar className="cursor-pointer">
                    <AvatarImage src={"/default.svg"} />
                    <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <Textarea placeholder="What's the vibe today?" maxLength={characterLimit} value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border border-primary/20 min-h-[120px] placeholder:text-[11px] md:placeholder:text-xs xl:placeholder:text-sm resize-none"
                />
            </section>
            <section className="flex justify-between items-center py-4 border-border border-t">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Image className="size-4" />
                        Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Video className="size-4" />
                        Video
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-[11px] md:text-xs xl:text-sm ${remainingChars < 20 ? "text-destructive" : "text-muted"}`}>
                        {remainingChars}
                    </span>
                    <Button onClick={handlePost} disabled={!content.trim() || isPosting || remainingChars < 0} className="min-w-[80px]">
                        {isPosting ? <Loader className="size-4" /> : <CircleCheckBig className="size-4" />}
                        <span style={{ marginLeft: 8 }}>{isPosting ? 'Posting...' : 'Post'}</span>
                    </Button>
                </div>
            </section>
        </Card>
    )
}
