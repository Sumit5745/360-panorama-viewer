import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/app/data/panoramas";
import { cn } from "@/lib/utils";

interface CategoryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  category: Category;
  isSelected?: boolean;
}

export function CategoryCard({
  category,
  isSelected,
  className,
  ...props
}: CategoryCardProps) {
  const Icon = category.icon;
  
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg",
        isSelected && "border-primary shadow-md",
        className
      )}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {category.title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {category.description}
        </p>
      </CardContent>
    </Card>
  );
} 