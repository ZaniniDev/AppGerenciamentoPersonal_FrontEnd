"use client";

import { type Control } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type WorkoutPlanFormValues } from "./create-workout-plan-form";

interface ExerciseFormItemProps {
  control: Control<WorkoutPlanFormValues>;
  dayIndex: number;
  exerciseIndex: number;
  onRemove: () => void;
}

const INPUT_CLASS =
  "h-12 rounded-xl border border-navy-border bg-navy-surface/50 text-sm text-foreground placeholder:text-foreground/40";

export function ExerciseFormItem({
  control,
  dayIndex,
  exerciseIndex,
  onRemove,
}: ExerciseFormItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-navy-border bg-navy-surface/30 p-4">
      <div className="flex items-center justify-between">
        <span className="font-heading text-sm font-semibold text-foreground">
          Exercício {exerciseIndex + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="size-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <FormField
        control={control}
        name={`workoutDays.${dayIndex}.exercises.${exerciseIndex}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-foreground/70">Nome do Exercício</FormLabel>
            <FormControl>
              <Input {...field} placeholder="ex: Agachamento" className={INPUT_CLASS} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-3">
        <FormField
          control={control}
          name={`workoutDays.${dayIndex}.exercises.${exerciseIndex}.sets`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-foreground/70">Séries</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} className={INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`workoutDays.${dayIndex}.exercises.${exerciseIndex}.reps`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-foreground/70">Reps</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} className={INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`workoutDays.${dayIndex}.exercises.${exerciseIndex}.restTimeInSeconds`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-foreground/70">Descanso (s)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} className={INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`workoutDays.${dayIndex}.exercises.${exerciseIndex}.exerciseLoad`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-foreground/70">Carga</FormLabel>
            <FormControl>
              <Input {...field} placeholder="ex: 20kg" className={INPUT_CLASS} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`workoutDays.${dayIndex}.exercises.${exerciseIndex}.obs`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-foreground/70">Observações</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Observações opcionais"
                className="min-h-10 resize-none rounded-xl border border-navy-border bg-navy-surface/50 text-sm text-foreground placeholder:text-foreground/40"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
