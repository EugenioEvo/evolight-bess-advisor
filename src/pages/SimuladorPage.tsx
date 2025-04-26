import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBessSize } from '@/hooks/useBessSize'
import { toast } from "sonner"

const formSchema = z.object({
  projectName: z.string().min(2, { message: "Nome do projeto deve ter no mínimo 2 caracteres" }),
  installationType: z.enum(["industrial", "commercial", "residential"]),
  
  bessCapacityKwh: z.coerce.number().min(1, { message: "Capacidade deve ser maior que 0" }),
  bessPowerKw: z.coerce.number().min(1, { message: "Potência deve ser maior que 0" }),
  bessEfficiency: z.coerce.number().min(50, { message: "Eficiência mínima é 50%" }).max(100, { message: "Eficiência máxima é 100%" }).default(90),
  bessMaxDod: z.coerce.number().min(1, { message: "DoD mínimo é 1%" }).max(100, { message: "DoD máximo é 100%" }).default(85),
  bessInitialSoc: z.coerce.number().min(0, { message: "SoC mínimo é 0%" }).max(100, { message: "SoC máximo é 100%" }).default(50),

  hasPv: z.boolean().default(false),
  pvPowerKwp: z.coerce.number().min(0).default(0),
  pvPolicy: z.enum(["inject", "grid_zero"]).default("inject"),
  
  tePeak: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  teOffpeak: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdPeakKwh: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdOffpeakKwh: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdPeakKw: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  tusdOffpeakKw: z.coerce.number().min(0, { message: "Valor deve ser maior ou igual a 0" }),
  peakStartHour: z.coerce.number().min(0, { message: "Valor deve estar entre 0 e 23" }).max(23, { message: "Valor deve estar entre 0 e 23" }).default(18),
  peakEndHour: z.coerce.number().min(0, { message: "Valor deve estar entre 0 e 23" }).max(23, { message: "Valor deve estar entre 0 e 23" }).default(21),
  
  hasDiesel: z.boolean().default(false),
  dieselPowerKw: z.coerce.number().min(0).default(0),
  dieselConsumption: z.coerce.number().min(0).default(0.3),
  dieselFuelCost: z.coerce.number().min(0).default(6.50),
  
  discountRate: z.coerce.number().min(0).default(10),
  horizonYears: z.coerce.number().min(1).default(10),
  businessModel: z.enum(["turnkey", "eaas"]).default("turnkey"),
  capexCost: z.coerce.number().min(0).default(0),
  annualOmCost: z.coerce.number().min(0).default(0),
  setupCost: z.coerce.number().min(0).default(0),
  annualServiceCost: z.coerce.number().min(0).default(0),
  
  usePeakShaving: z.boolean().default(true),
  useArbitrage: z.boolean().default(false),
  useBackup: z.boolean().default(false),
  usePvOptim: z.boolean().default(false),
  peakShavingTarget: z.coerce.number().min(0).default(0),
});

const SimuladorPage: React.FC = () => {
  const { calculateBessSize } = useBessSize()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      installationType: "industrial",
      bessCapacityKwh: 215,
      bessPowerKw: 108,
      bessEfficiency: 90,
      bessMaxDod: 85,
      bessInitialSoc: 50,
      hasPv: false,
      pvPowerKwp: 0,
      pvPolicy: "inject",
      tePeak: 0.80,
      teOffpeak: 0.40,
      tusdPeakKwh: 0.20,
      tusdOffpeakKwh: 0.10,
      tusdPeakKw: 50.0,
      tusdOffpeakKw: 10.0,
      peakStartHour: 18,
      peakEndHour: 21,
      hasDiesel: false,
      dieselPowerKw: 0,
      dieselConsumption: 0.3,
      dieselFuelCost: 6.50,
      discountRate: 10,
      horizonYears: 10,
      businessModel: "turnkey",
      capexCost: 0,
      annualOmCost: 0,
      setupCost: 0,
      annualServiceCost: 0,
      usePeakShaving: true,
      useArbitrage: false,
      useBackup: false,
      usePvOptim: false,
      peakShavingTarget: 0,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const load_profile = [50, 45, 40, 40, 45, 55, 70, 80, 90, 100, 110, 115, 110, 105, 100, 100, 110, 150, 160, 140, 120, 100, 80, 60]
      
      const sizingResult = await calculateBessSize({
        load_profile,
        pv_profile: values.hasPv ? [0, 0, 0, 0, 0, 5, 20, 40, 60, 70, 75, 70, 60, 40, 20, 5, 0, 0, 0, 0, 0, 0, 0, 0].map(v => v * (values.pvPowerKwp / 75)) : undefined,
        tariff_structure: {
          peak_start_hour: values.peakStartHour,
          peak_end_hour: values.peakEndHour
        },
        sizing_params: {
          backup_required: values.useBackup,
          peak_shaving_required: values.usePeakShaving,
          peak_shaving_target_kw: values.peakShavingTarget,
          arbitrage_required: values.useArbitrage,
          pv_optim_required: values.usePvOptim,
          grid_zero: values.pvPolicy === 'grid_zero'
        },
        bess_technical_params: {
          discharge_eff: Math.sqrt(values.bessEfficiency / 100),
          charge_eff: Math.sqrt(values.bessEfficiency / 100)
        },
        simulation_params: {
          interval_minutes: 60
        }
      })

      form.setValue('bessPowerKw', sizingResult.calculated_power_kw)
      form.setValue('bessCapacityKwh', sizingResult.calculated_energy_kwh)
      
      toast.success("BESS dimensionado com sucesso!", {
        description: `Potência: ${sizingResult.calculated_power_kw} kW, Capacidade: ${sizingResult.calculated_energy_kwh} kWh`
      })
      
      console.log(values)
    } catch (error) {
      console.error('Error calculating BESS size:', error)
      toast.error("Erro ao dimensionar BESS", {
        description: "Tente novamente ou ajuste os parâmetros"
      })
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 container py-6 px-4 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-evolight-navy mb-2">Simulador BESS</h1>
          <p className="text-gray-600">Configure e execute simulações de sistemas de armazenamento de energia por bateria.</p>
        </div>
        
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dados">Entrada de Dados</TabsTrigger>
            <TabsTrigger value="analise">Análise & Dimensionamento</TabsTrigger>
            <TabsTrigger value="resultados">Resultados & Relatórios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados">
            <Card>
              <CardHeader>
                <CardTitle>Entrada de Dados</CardTitle>
                <CardDescription>
                  Forneça os dados necessários para simular seu sistema BESS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Informações Básicas */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Informações Básicas do Projeto</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="projectName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome do Projeto</FormLabel>
                              <FormControl>
                                <Input placeholder="Projeto BESS" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="installationType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Instalação</FormLabel>
                              <FormControl>
                                <RadioGroup 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  className="flex flex-row space-x-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="industrial" id="industrial" />
                                    <FormLabel htmlFor="industrial" className="font-normal">Industrial</FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="commercial" id="commercial" />
                                    <FormLabel htmlFor="commercial" className="font-normal">Comercial</FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="residential" id="residential" />
                                    <FormLabel htmlFor="residential" className="font-normal">Residencial</FormLabel>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Dados do BESS */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Parâmetros Técnicos do BESS</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="bessCapacityKwh"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Capacidade (kWh)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bessPowerKw"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Potência (kW)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bessEfficiency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Eficiência (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bessMaxDod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max DoD (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bessInitialSoc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SoC Inicial (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Sistema Solar PV */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Sistema Solar Fotovoltaico</h3>
                        <FormField
                          control={form.control}
                          name="hasPv"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormLabel>Possui/Planeja PV?</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.watch("hasPv") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="pvPowerKwp"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Potência Instalada (kWp)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="pvPolicy"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Política com a Rede</FormLabel>
                                <FormControl>
                                  <RadioGroup 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="inject" id="inject" />
                                      <FormLabel htmlFor="inject" className="font-normal">Injeta Excedente</FormLabel>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="grid_zero" id="grid_zero" />
                                      <FormLabel htmlFor="grid_zero" className="font-normal">Não Injeta (Grid-Zero)</FormLabel>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Estrutura Tarifária */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Estrutura Tarifária</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="tePeak"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TE Ponta (R$/kWh)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="teOffpeak"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TE Fora Ponta (R$/kWh)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="tusdPeakKwh"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TUSD Ponta (R$/kWh)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="tusdOffpeakKwh"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TUSD Fora Ponta (R$/kWh)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="tusdPeakKw"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TUSD Demanda Ponta (R$/kW)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="tusdOffpeakKw"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TUSD Demanda FP (R$/kW)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="peakStartHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Início Ponta (hora)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="23" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="peakEndHour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fim Ponta (hora)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="23" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Gerador Diesel */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Gerador Diesel Existente</h3>
                        <FormField
                          control={form.control}
                          name="hasDiesel"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormLabel>Possui Gerador Diesel?</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.watch("hasDiesel") && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="dieselPowerKw"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Potência Total (kW)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="dieselConsumption"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Consumo (L/kWh)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="dieselFuelCost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Custo Combustível (R$/L)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Parâmetros Financeiros */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Parâmetros Financeiros</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="discountRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Taxa de Desconto (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="horizonYears"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horizonte (Anos)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="businessModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Modelo de Negócio</FormLabel>
                              <FormControl>
                                <RadioGroup 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  className="flex flex-row space-x-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="turnkey" id="turnkey" />
                                    <FormLabel htmlFor="turnkey" className="font-normal">Compra Direta</FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="eaas" id="eaas" />
                                    <FormLabel htmlFor="eaas" className="font-normal">Locação/EAAS</FormLabel>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.watch("businessModel") === "turnkey" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="capexCost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Custo BESS (R$)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="1000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="annualOmCost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Custo O&M Anual (R$)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="100" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="setupCost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Custo Setup Inicial (R$)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="1000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="annualServiceCost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Custo Anual Serviço (R$)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="1000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Estratégias de Controle */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Aplicações BESS Desejadas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="usePeakShaving"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Peak Shaving (Gestão de Demanda)</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          {form.watch("usePeakShaving") && (
                            <FormField
                              control={form.control}
                              name="peakShavingTarget"
                              render={({ field }) => (
                                <FormItem className="pl-8">
                                  <FormLabel>Meta de Demanda Máxima (kW)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="useArbitrage"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Arbitragem (Energy Time Shifting)</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="useBackup"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Backup/Reserva</FormLabel>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="usePvOptim"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <FormLabel>Otimização Autoconsumo PV</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button type="submit">Avançar para Análise</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analise">
            <Card>
              <CardHeader>
                <CardTitle>Análise & Dimensionamento</CardTitle>
                <CardDescription>
                  Processamento e análise técnico-financeira baseada nos dados fornecidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-center text-gray-500 py-12">
                  Funcionalidade em desenvolvimento. Esta seção exibirá o progresso do processamento dos dados, 
                  dimensionamento do sistema e simulação temporal da operação.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resultados">
            <Card>
              <CardHeader>
                <CardTitle>Resultados & Relatórios</CardTitle>
                <CardDescription>
                  Visualize os resultados da simulação e gere relatórios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-center text-gray-500 py-12">
                  Funcionalidade em desenvolvimento. Esta seção exibirá um dashboard resumo, 
                  gráficos interativos e permitirá a exportação do relatório detalhado.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Evolight Energia Inovadora. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default SimuladorPage;
