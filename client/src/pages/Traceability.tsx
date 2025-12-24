import { useParams, useLocation } from "wouter";
import { useTraceability } from "@/hooks/use-traceability";
import { Loader2, CheckCircle2, MapPin, Calendar, Leaf, Truck, Factory, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export default function Traceability() {
  const { batchId } = useParams();
  const [location, setLocation] = useLocation();
  const [searchId, setSearchId] = useState("");
  
  // If no batchId, show search
  if (!batchId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <div className="w-full max-w-md space-y-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Search size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold">Product Traceability</h1>
            <p className="text-muted-foreground">Enter the Batch ID found on your product's QR code or label to trace its journey.</p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if(searchId) setLocation(`/traceability/${searchId}`);
              }}
              className="flex gap-2"
            >
              <Input 
                placeholder="e.g. BATCH-2024-001" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="h-12 text-lg"
              />
              <Button type="submit" size="lg" className="h-12 bg-primary hover:bg-primary/90">Trace</Button>
            </form>
            
            <div className="pt-8">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Or try demo batch</p>
              <Button variant="outline" onClick={() => setLocation('/traceability/demo')}>
                View Demo Batch
              </Button>
            </div>
         </div>
      </div>
    );
  }

  // Demo mode simulation if ID is 'demo'
  const isDemo = batchId === 'demo';
  const { data: realData, isLoading, error } = useTraceability(isDemo ? "" : batchId);

  // Mock data for demo
  const data = isDemo ? {
    batchIdentifier: "BATCH-DEMO-2024",
    quantity: 500,
    harvestDate: new Date().toISOString(),
    farm: { name: "Green Valley Organics", location: { lat: 34.05, lng: -118.24 }, type: "Organic" },
    crop: { name: "Heirloom Tomatoes", variety: "Cherokee Purple" },
    carbon: { emissions: 12.5, certificateHash: "0x7f...3a2b" },
    events: [
      { id: 1, stage: "Harvest", location: "Field 4, Green Valley", handler: "John Doe", timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 2, stage: "Processing", location: "Central Hub", handler: "FreshPack Co.", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 3, stage: "Transport", location: "Route 66", handler: "LogiTrans", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 4, stage: "Retail", location: "Whole Foods Market", handler: "Store Mgr", timestamp: new Date(Date.now() - 3600000).toISOString() },
    ]
  } : realData;

  if (isLoading && !isDemo) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (error || (!data && !isDemo)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Batch Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find any information for Batch ID: {batchId}</p>
        <Button onClick={() => setLocation('/traceability')}>Search Again</Button>
      </div>
    );
  }

  const getStageIcon = (stage: string) => {
    switch(stage.toLowerCase()) {
      case 'harvest': return <Leaf size={20} />;
      case 'transport': return <Truck size={20} />;
      case 'processing': return <Factory size={20} />;
      case 'retail': return <ShoppingBag size={20} />;
      default: return <CheckCircle2 size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-6">
            <CheckCircle2 size={14} className="text-green-400" />
            Verified Authentic
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{data.crop.name}</h1>
          <p className="text-primary-foreground/80 text-lg">{data.crop.variety} • Grown by {data.farm.name}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-20 pb-20">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">Harvest Date</p>
            <p className="text-lg font-bold flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              {format(new Date(data.harvestDate), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
             <p className="text-sm text-muted-foreground mb-1">Carbon Footprint</p>
             <p className="text-lg font-bold flex items-center gap-2 text-green-600">
               <Leaf size={18} />
               {data.carbon?.emissions ?? '0.0'} kg CO2e
             </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
          <h2 className="text-2xl font-display font-bold mb-8">Journey Timeline</h2>
          
          <div className="space-y-8 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-border">
            {data.events.map((event: any, index: number) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative pl-20"
              >
                <div className={clsx(
                  "absolute left-0 top-0 w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-card shadow-sm z-10",
                  index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                )}>
                  {getStageIcon(event.stage)}
                </div>
                
                <div className="pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                    <h3 className="text-lg font-bold">{event.stage}</h3>
                    <span className="text-sm text-muted-foreground font-mono">{format(new Date(event.timestamp), 'MMM d, h:mm a')}</span>
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} /> {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Handler:</span> {event.handler}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Blockchain Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground font-mono bg-muted/50 inline-block px-4 py-2 rounded-lg break-all">
            Blockchain Hash: {data.carbon?.certificateHash || "0x7f83b...3a2b19"}
          </p>
          <div className="mt-4">
            <Button variant="link" onClick={() => setLocation('/traceability')}>Search Another Batch</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
