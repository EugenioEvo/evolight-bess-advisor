
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  buttonText: string;
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  to,
  buttonText,
  color = 'bg-white',
}) => {
  return (
    <Card className={`h-full transition-all hover:shadow-md ${color}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="text-evolight-gold">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold mt-2">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full justify-between">
          <Link to={to}>
            {buttonText}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
