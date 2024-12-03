import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const CreateEntityTypeDialog = ({ open, onOpenChange, onCreate }) => {
  const [newEntityType, setNewEntityType] = useState({
    value: "",
    label: "",
    description: "",
  });

  const handleSubmit = () => {
    onCreate(newEntityType);
    setNewEntityType({ value: "", label: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Entity Type</DialogTitle>
          <DialogDescription>
            Define a new entity type for your system
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <Input
              id="value"
              value={newEntityType.value}
              onChange={(e) =>
                setNewEntityType((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              placeholder="Unique identifier"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={newEntityType.label}
              onChange={(e) =>
                setNewEntityType((prev) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              placeholder="Display name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={newEntityType.description}
              onChange={(e) =>
                setNewEntityType((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of the entity type"
              className="col-span-3"
            />
          </div>
          <Button onClick={handleSubmit}>Create Entity Type</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
