
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, AlertTriangle, Save } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    company: profile?.company || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const { success, error } = await updateProfile(formData);
    
    if (!success && error) {
      setError(error);
      setIsSubmitting(false);
      return;
    }
    
    toast.success('Perfil atualizado com sucesso!');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Seu Perfil</h1>
        
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div>
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-evolight-gold/20 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-evolight-gold" />
                </div>
                
                <h2 className="font-medium text-lg">
                  {profile?.full_name || user?.email}
                </h2>
                
                {profile?.username && (
                  <p className="text-gray-500">@{profile.username}</p>
                )}
                
                <p className="text-sm text-gray-500 mt-1">
                  {user?.email}
                </p>
                
                <Button 
                  variant="ghost" 
                  className="mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={signOut}
                >
                  Sair
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informações do perfil</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="seu_usuario"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Seu Nome Completo"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Nome da empresa"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-evolight-navy hover:bg-evolight-navy/90"
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
