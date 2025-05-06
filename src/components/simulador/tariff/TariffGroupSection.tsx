
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { SimuladorFormValues } from "@/schemas/simuladorSchema";

interface TariffGroupSectionProps {
  form: UseFormReturn<SimuladorFormValues>;
}

export function TariffGroupSection({ form }: TariffGroupSectionProps) {
  const tarifaryGroup = form.watch("tarifaryGroup");

  return (
    <div className="mb-6">
      <h4 className="text-md font-medium mb-2">Grupo Tarifário</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="tarifaryGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grupo Tarifário</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grupo tarifário" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="groupA">Grupo A (Alta/Média Tensão)</SelectItem>
                  <SelectItem value="groupB">Grupo B (Baixa Tensão)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {tarifaryGroup === "groupA" && (
          <FormField
            control={form.control}
            name="modalityA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modalidade Tarifária</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a modalidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="blue">Azul (Binômia com DP)</SelectItem>
                    <SelectItem value="green">Verde (Binômia)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
