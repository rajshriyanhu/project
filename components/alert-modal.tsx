import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { Button } from './ui/button';

export default function AlertModal({
  showDeleteDialog,
  setShowDeleteDialog,
  handleDelete,
  title,
  description,
} : {
  showDeleteDialog: boolean,
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>,
  handleDelete: () => void,
  title: string,
  description: string,
}) {
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  )
}
