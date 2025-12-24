import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useCreateFarm } from "@/hooks/use-farms";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";

export function CreateFarmDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateFarm();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    size: "",
    type: "Conventional",
    lat: "",
    lng: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      mutate({
        name: formData.name,
        size: z.coerce.number().parse(formData.size),
        type: formData.type,
        location: {
          lat: z.coerce.number().parse(formData.lat || "0"),
          lng: z.coerce.number().parse(formData.lng || "0")
        },
        userId: "current-user", // Backend will overwrite this with actual user
      }, {
        onSuccess: () => {
          setOpen(false);
          setFormData({ name: "", size: "", type: "Conventional", lat: "", lng: "" });
          toast({ title: "Farm Created", description: "Your new farm has been added successfully." });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      });
    } catch (err) {
      toast({ title: "Validation Error", description: "Please check your inputs.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Plus size={18} />
          Add Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Farm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name</Label>
            <Input 
              id="name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Sunny Acres"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size (Hectares)</Label>
              <Input 
                id="size" 
                type="number" 
                required
                step="0.1"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                placeholder="10.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Farming Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(v) => setFormData({...formData, type: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conventional">Conventional</SelectItem>
                  <SelectItem value="Organic">Organic</SelectItem>
                  <SelectItem value="Hydroponic">Hydroponic</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input 
                id="lat" 
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => setFormData({...formData, lat: e.target.value})}
                placeholder="0.0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input 
                id="lng" 
                type="number" 
                step="any"
                value={formData.lng}
                onChange={(e) => setFormData({...formData, lng: e.target.value})}
                placeholder="0.0000"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Farm
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
