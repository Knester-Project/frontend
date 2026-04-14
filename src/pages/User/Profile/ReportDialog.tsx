import { useState } from 'react';

// UIs
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

const REPORT_REASONS = [
    "Harassment",
    "Spam",
    "Inappropriate Content",
    "Impersonation",
    "Public Disclosure",
    "Defamation",
    "Homophobic",
    "Other"
];

export const ReportDialog = ({ trigger, onReport, isLoading }: {
    trigger: React.ReactNode,
    onReport: (reason: string, isBlocked: boolean) => void,
    isLoading: boolean
}) => {

    const [reason, setReason] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);

    const handleSubmit = () => {
        if (!reason) return;
        onReport(reason, isBlocked);
        setOpen(false);
        setReason("");
        setIsBlocked(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">

                    <Select onValueChange={setReason}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                            {REPORT_REASONS.map(r => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Textarea placeholder="Additional details..." value={reason} onChange={(e) => setReason(e.target.value)} />

                    {/* Block Toggle */}
                    <div className="flex justify-between items-center">
                        <p className="font-medium">Block this user</p>
                        <Switch checked={isBlocked} onCheckedChange={() => setIsBlocked((prev) => !prev)} />
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="destructive" onClick={handleSubmit} disabled={isLoading || !reason}>
                        Submit Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};