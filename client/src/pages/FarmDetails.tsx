import { PageLayout } from "@/components/Navigation";
import { useParams } from "wouter";
import { useFarm, useCreateCrop, useCreateActivity } from "@/hooks/use-farms";
import { useAdvisories, useGenerateAdvisory } from "@/hooks/use-advisories";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Droplets, Bug, AlertTriangle, Plus, Sparkles, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { clsx } from "clsx";

export default function FarmDetails() {
  const { id } = useParams();
  const farmId = Number(id);
  const { data: farm, isLoading } = useFarm(farmId);
  const { data: advisories, isLoading: loadingAdvisories } = useAdvisories(farmId);
  const { mutate: generateAdvisory, isPending: generatingAdvisory } = useGenerateAdvisory(farmId);

  if (isLoading || !farm) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{farm.name}</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="bg-secondary px-2 py-0.5 rounded text-xs font-semibold">{farm.type}</span>
              • {farm.size} Hectares
            </p>
          </div>
          <div className="flex gap-3">
             <AddCropDialog farmId={farmId} />
             <Button 
               onClick={() => generateAdvisory()} 
               disabled={generatingAdvisory}
               className="bg-accent text-accent-foreground hover:bg-accent/90"
             >
               {generatingAdvisory ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
               Get AI Advice
             </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Crops */}
          <section>
            <h2 className="text-xl font-bold font-display mb-4">Active Crops</h2>
            {farm.crops?.length === 0 ? (
               <div className="bg-card rounded-xl p-8 border border-dashed border-border text-center text-muted-foreground">
                 No crops planted yet. Add a crop to get started.
               </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {farm.crops?.map(crop => (
                  <div key={crop.id} className="bg-card p-5 rounded-xl border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{crop.name}</h3>
                      <span className={clsx(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        crop.status === 'growing' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {crop.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{crop.variety || 'Standard Variety'}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Planted: {crop.plantingDate ? format(new Date(crop.plantingDate), 'MMM d, yyyy') : 'N/A'}</p>
                      <p>Harvest: {crop.expectedHarvestDate ? format(new Date(crop.expectedHarvestDate), 'MMM yyyy') : 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Activity Timeline */}
          <section>
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold font-display">Recent Activities</h2>
               <LogActivityDialog farmId={farmId} />
             </div>
             <div className="bg-card rounded-xl border border-border p-6">
                {farm.activities?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No activities logged recently.</p>
                ) : (
                  <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                    {farm.activities?.map((activity) => (
                      <div key={activity.id} className="relative pl-10">
                        <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-sm" />
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h4 className="font-semibold text-foreground capitalize">{activity.type}</h4>
                          <span className="text-xs text-muted-foreground">{format(new Date(activity.date), 'MMM d, yyyy')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </section>
        </div>

        {/* Sidebar: Advisories & Weather */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <h3 className="font-bold font-display mb-4 flex items-center gap-2">
              <Sparkles className="text-accent-foreground" size={18} />
              AI Advisories
            </h3>
            {loadingAdvisories ? (
              <div className="space-y-3">
                {[1,2].map(i => <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-lg" />)}
              </div>
            ) : advisories?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No advisories generated yet. Click "Get AI Advice" to analyze your farm.
              </p>
            ) : (
              <div className="space-y-4">
                {advisories?.map(advisory => (
                  <div key={advisory.id} className="bg-secondary/30 rounded-lg p-4 border border-secondary">
                    <div className="flex items-center gap-2 mb-2">
                      {advisory.type === 'weather' && <Droplets size={16} className="text-blue-500" />}
                      {advisory.type === 'pest' && <Bug size={16} className="text-red-500" />}
                      {advisory.type === 'general' && <AlertTriangle size={16} className="text-orange-500" />}
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{advisory.type}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{advisory.message}</p>
                    <p className="text-xs text-muted-foreground mt-3 text-right">
                      {advisory.createdAt && format(new Date(advisory.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function AddCropDialog({ farmId }: { farmId: number }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateCrop(farmId);
  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, variety }, { 
      onSuccess: () => {
        setOpen(false);
        setName("");
        setVariety("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus size={16} className="mr-2" /> Add Crop</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Crop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Crop Name</Label>
            <Input placeholder="e.g. Corn" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Variety (Optional)</Label>
            <Input placeholder="e.g. Sweet Corn" value={variety} onChange={e => setVariety(e.target.value)} />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>{isPending ? "Adding..." : "Add Crop"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function LogActivityDialog({ farmId }: { farmId: number }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateActivity(farmId);
  const [type, setType] = useState("irrigation");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ 
      type, 
      details,
      date: new Date().toISOString() // In a real app, use a date picker
    }, { 
      onSuccess: () => {
        setOpen(false);
        setDetails("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5">
          <Plus size={16} className="mr-2" /> Log Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="planting">Planting</option>
              <option value="irrigation">Irrigation</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="pest_control">Pest Control</option>
              <option value="harvesting">Harvesting</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Details</Label>
            <Input placeholder="e.g. Applied 50L of water" value={details} onChange={e => setDetails(e.target.value)} required />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>{isPending ? "Logging..." : "Save Activity"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
