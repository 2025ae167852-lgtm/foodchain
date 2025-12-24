import { PageLayout } from "@/components/Navigation";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/hooks/use-auth";
import { useFarms } from "@/hooks/use-farms";
import { Tractor, Sprout, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: farms, isLoading } = useFarms();

  const totalHectares = farms?.reduce((acc, farm) => acc + farm.size, 0) || 0;
  const farmCount = farms?.length || 0;

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Welcome back, {user?.firstName || 'Farmer'}
        </h1>
        <p className="text-muted-foreground mt-2">Here's what's happening on your farms today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Farms" 
          value={farmCount} 
          icon={<Tractor size={24} />} 
          color="primary"
        />
        <StatCard 
          title="Total Area" 
          value={`${totalHectares} ha`} 
          icon={<Sprout size={24} />} 
          color="accent"
        />
        <StatCard 
          title="Active Alerts" 
          value="2" 
          icon={<AlertCircle size={24} />} 
          color="orange"
          trend="New pest alert"
          trendUp={false}
        />
        <StatCard 
          title="Est. Yield" 
          value="124 tons" 
          icon={<TrendingUp size={24} />} 
          color="blue"
          trend="12% vs last year"
          trendUp={true}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Farm List */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">Your Farms</h2>
            <Link href="/farms" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-2xl" />)}
            </div>
          ) : farms?.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No farms added yet.</p>
              <Link href="/farms" className="text-primary font-medium mt-2 block hover:underline">Create your first farm</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {farms?.slice(0, 3).map((farm, i) => (
                <motion.div 
                  key={farm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/farms/${farm.id}`}>
                    <div className="group bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold font-display group-hover:text-primary transition-colors">{farm.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{farm.location.lat.toFixed(4)}, {farm.location.lng.toFixed(4)} • {farm.type}</p>
                        </div>
                        <div className="bg-secondary px-3 py-1 rounded-full text-xs font-medium text-secondary-foreground">
                          {farm.size} ha
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions / Weather Placeholder */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold">Quick Actions</h2>
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-lg shadow-primary/20">
            <h3 className="font-bold text-lg mb-2">Generate Reports</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">Create comprehensive yield and sustainability reports for your stakeholders.</p>
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full border border-white/10">
              Create Report
            </button>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
             <h3 className="font-bold text-lg mb-4">Today's Weather</h3>
             <div className="flex items-center gap-4">
               <div className="text-4xl font-display font-bold text-foreground">24°C</div>
               <div className="text-sm text-muted-foreground">
                 <p>Sunny</p>
                 <p>Humidity: 45%</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
