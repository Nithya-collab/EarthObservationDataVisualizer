import React from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DetailsCardProps {
    title: string;
    data: Record<string, string | number | null | undefined>;
    onClose: () => void;
}

export function DetailsCard({ title, data, onClose }: DetailsCardProps) {
    return (
        <Card className="absolute top-20 right-4 z-50 w-80 shadow-xl bg-white/90 dark:bg-black/90 backdrop-blur-sm border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex flex-col border-b pb-1 last:border-0">
                            <span className="font-medium text-muted-foreground capitalize text-xs">
                                {key.replace(/_/g, " ")}
                            </span>
                            <span className="truncate" title={String(value ?? "---")}>
                                {value ?? "---"}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
