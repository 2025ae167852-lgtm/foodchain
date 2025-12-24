import { PageLayout } from "@/components/Navigation";
import { CreateFarmDialog } from "@/components/CreateFarmDialog";
import { useFarms } from "@/hooks/use-farms";
import { Link } from "wouter";
import { MapPin, Sprout, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Farms() {
  const { data: farms, isLoading } = useFarms();

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Farms</h1>
          <p className="text-muted-foreground mt-1">Manage your land, crops, and harvests.</p>
        </div>
        <CreateFarmDialog />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-2xl" />)}
        </div>
      ) : farms?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-3xl border border-dashed border-border text-center">
          <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <Sprout className="text-muted-foreground" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No farms yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">Start by adding your first farm to track crops, yields, and get AI advisories.</p>
          <CreateFarmDialog />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms?.map((farm, i) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/farms/${farm.id}`} className="block h-full">
                <div className="bg-card h-full rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Sprout size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-secondary-foreground/10">
                      {farm.type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">{farm.name}</h3>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <MapPin size={16} className="mr-1" />
                    {farm.location.lat.toFixed(2)}, {farm.location.lng.toFixed(2)}
                  </div>

                  <div className="mt-auto pt-6 border-t border-border flex items-center justify-between text-sm">
                    <span className="font-medium">{farm.size} Hectares</span>
                    <span className="flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight size={16} className="ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
