
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWizard } from '../context/WizardContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Calendar, Clock, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SavedSimulationsList() {
  const [simulations, setSimulations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loadSavedSimulation } = useWizard();
  
  const loadSimulations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSimulations([]);
        setError('Para ver suas simulações salvas, faça login.');
        return;
      }
      
      const { data, error } = await supabase
        .from('saved_simulations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      setSimulations(data || []);
    } catch (err) {
      console.error('Error loading saved simulations:', err);
      setError('Não foi possível carregar suas simulações salvas.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadSimulations();
  }, []);
  
  const deleteSimulation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_simulations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Reload the list after deletion
      loadSimulations();
    } catch (err) {
      console.error('Error deleting simulation:', err);
      setError('Não foi possível excluir a simulação.');
    }
  };
  
  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Carregando suas simulações...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">{error}</p>
          {error.includes('login') && (
            <Button className="mt-4" variant="outline">
              Fazer Login
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  if (simulations.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Você ainda não possui simulações salvas.</p>
          <Button className="mt-4" variant="outline">
            Criar Nova Simulação
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Simulações Salvas</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {simulations.map((simulation) => (
          <Card key={simulation.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{simulation.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" /> 
                Atualizado: {format(new Date(simulation.updated_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 mt-1">
                {simulation.input_values?.siteType && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {simulation.input_values.siteType === 'industrial' ? 'Industrial' : 
                     simulation.input_values.siteType === 'commercial' ? 'Comercial' : 
                     simulation.input_values.siteType === 'rural' ? 'Rural' : 'Outro'}
                  </span>
                )}
                {simulation.input_values?.tariffGroup && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {simulation.input_values.tariffGroup === 'groupA' ? 'Grupo A' : 
                     simulation.input_values.tariffGroup === 'groupB' ? 'Grupo B' : 'Tarifa Desconhecida'}
                  </span>
                )}
                {simulation.results && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <BarChart2 className="h-3 w-3" /> Resultados
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadSavedSimulation(simulation.id)}
              >
                Abrir
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir simulação?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. A simulação "{simulation.name}" será permanentemente excluída.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteSimulation(simulation.id)} className="bg-red-500 hover:bg-red-600">
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
