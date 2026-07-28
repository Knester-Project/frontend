// Libs
import { cn } from "@/lib/utils";

// UIs
import { Button } from "@/components/ui/button";

// Icons
import { Refresh2 } from "iconsax-reactjs";

type MessageErrorProps = {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
    className?: string;
};

const MessageError = ({ title, description, actionLabel, onAction, icon, className }: MessageErrorProps) => {
    return (
        <div className={cn("flex justify-center px-4 py-8", className)}>
            <div className="bg-card shadow p-4 md:p-5 border border-border rounded-2xl w-full max-w-md text-center xlP-6">
                {icon && (
                    <div className="flex justify-center mb-4">
                        {icon}
                    </div>
                )}

                <h3 className="font-semibold">
                    {title}
                </h3>

                {description && (
                    <p className="mt-2 text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                        {description}
                    </p>
                )}

                {actionLabel && onAction && (
                    <Button onClick={onAction} size="sm" className="gap-2 mt-5">
                        <Refresh2 size={16} />
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default MessageError;