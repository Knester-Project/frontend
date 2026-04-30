// Icons
import { Setting5 } from "iconsax-reactjs";

export function EmptyHint({ text }: { text: string }) {
    return (
        <main className="flex flex-col justify-center items-center mx-auto py-16">
            <div className="flex justify-center items-center bg-muted mb-4 rounded-2xl size-10 md:size-12 xl:size-14">
                <Setting5 className="size-5 md:size-6 xl:size-7 text-primary" />
            </div>
            <p className="max-w-xs text-[11px] text-muted-foreground md:text-xs xl:text-sm">{text}</p>
        </main>
    );
}

