import { useState } from 'react';

// UIs
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
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

export const ReportDialog = ({ trigger, onReport, isLoading, username, blockedByMe }: {
    trigger: React.ReactNode,
    onReport: (reason: string, blockedByMe: boolean) => void,
    isLoading: boolean,
    username: string,
    blockedByMe: boolean;
}) => {

    const [reason, setReason] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [isBlocked, setIsBlocked] = useState<boolean>(blockedByMe);

    const handleSubmit = () => {
        if (!reason) return;
        if (isBlocked && blockedByMe === false) {
            onReport(reason, isBlocked);
        } else {
            onReport(reason, false)
        }
        setOpen(false);
        setReason("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent aria-describedby={"Report and Block Users"}>
                <DialogHeader>
                    <DialogTitle>Report {username}</DialogTitle>
                    <DialogDescription>Use this form to report inappropriate behavior or block this user if you no longer want to see their content.</DialogDescription>
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
                        <p className="font-medium">Block {username}</p>
                        <Switch checked={isBlocked} disabled={blockedByMe} onCheckedChange={() => setIsBlocked((prev) => !prev)} />
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