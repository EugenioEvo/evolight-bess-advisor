
import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";
import { ProjectInfo } from './ProjectInfo';
import { BessSection } from './BessSection';
import { PvSection } from './PvSection';
import { TariffSection } from './TariffSection';
import { DieselSection } from './DieselSection';
import { FinancialSection } from './FinancialSection';
import { ControlStrategies } from './ControlStrategies';

interface SimuladorFormProps {
  form: UseFormReturn<SimuladorFormValues>;
  onSubmit: (values: SimuladorFormValues) => Promise<void>;
}

export function SimuladorForm({ form, onSubmit }: SimuladorFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProjectInfo form={form} />
        <Separator />
        <BessSection form={form} />
        <Separator />
        <PvSection form={form} />
        <Separator />
        <TariffSection form={form} />
        <Separator />
        <DieselSection form={form} />
        <Separator />
        <FinancialSection form={form} />
        <Separator />
        <ControlStrategies form={form} />
        <div className="flex justify-end pt-4">
          <Button type="submit">Dimensionar e Simular</Button>
        </div>
      </form>
    </Form>
  );
}
