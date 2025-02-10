import { Expense, Trip } from "@/types";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Receipt,
  Tag,
  ReceiptSwissFrancIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useDeleteExpense } from "@/hooks/use-expense-hook";
import CreateExpenseModal from "./create-expense-modal";

export default function ExpenseList({ trip }: { trip: Trip }) {
  const [openModal, setOpenModal] = useState(false);
  const { mutate: deleteExpense } = useDeleteExpense();
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);

  const totalAmount = trip.expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const handleEdit = (expenseId: string) => {
    // TODO: Implement edit functionality
    setSelectedExpense(
      trip.expenses.find((expense) => expense.id === expenseId) || undefined
    );
    if(!selectedExpense)return;
    setOpenModal(true);
    console.log("Edit expense:", expenseId);
  };

  const handleDelete = async (expenseId: string) => {
    console.log("Delete expense:", expenseId);
    deleteExpense({ tripId: trip.id, expenseId });
  };

  return (
    <Card className="w-full h-min">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ReceiptSwissFrancIcon className="h-6 w-6 text-violet-500" />
            <span>Your Expenses</span>
          </div>
          <div className="flex items-center gap-2 text-xl bg-violet-500/10 px-4 py-2 rounded-full">
            <span>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(totalAmount)}
            </span>
          </div>
        </CardTitle>
        <CardDescription>
          Track all your expenses and see where your money is going during this
          trip.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {trip.expenses.map((expense: Expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-violet-500/10">
                <Receipt className="h-5 w-5 text-violet-500" />
              </div>
              <div className="flex flex-col">
                <p className="font-medium">{expense.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span>{expense.category.name}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(expense.amount)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-violet-500"
                  onClick={() => handleEdit(expense.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CreateExpenseModal
      expense={selectedExpense}
        tripId={trip.id}
        isModalOpen={openModal}
        setIsModalOpen={setOpenModal}
      />
    </Card>
  );
}
