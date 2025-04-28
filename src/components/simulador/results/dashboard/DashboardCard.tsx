
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
}

export function DashboardCard({ title, value, subtitle }: DashboardCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}
