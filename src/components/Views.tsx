// Icons
import { Eye } from "iconsax-reactjs";

const Views = ({views}: {views: number}) => {
    return (
        <main className="flex justify-end items-center gap-x-1 font-medium text-[11px] text-muted-foreground md:text-xs xl:text-sm montserrat">
            {views}
            <Eye className="size-3 md:size-3.5 xl:size-4" />
        </main>
    );
}

export default Views;