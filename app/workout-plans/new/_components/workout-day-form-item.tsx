"use client";

import { type Control, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ExerciseFormItem } from "./exercise-form-item";
import { type WorkoutPlanFormValues } from "./create-workout-plan-form";

interface WorkoutDayFormItemProps {
  control: Control<WorkoutPlanFormValues>;
  dayIndex: number;
  onRemove: () => void;
  usedWeekDays: string[];
}

const WEEKDAY_OPTIONS = [
  { value: "MONDAY", label: "Segunda-feira" },
  { value: "TUESDAY", label: "Terça-feira" },
  { value: "WEDNESDAY", label: "Quarta-feira" },
  { value: "THURSDAY", label: "Quinta-feira" },
  { value: "FRIDAY", label: "Sexta-feira" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const INPUT_CLASS =
  "h-12 rounded-xl border border-navy-border bg-navy-surface/50 text-sm text-foreground placeholder:text-foreground/40";

export function WorkoutDayFormItem({
  control,
  dayIndex,
  onRemove,
  usedWeekDays,
}: WorkoutDayFormItemProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `workoutDays.${dayIndex}.exercises`,
  });

  const isRest = useWatch({
    control,
    name: `workoutDays.${dayIndex}.isRest`,
  });

  const currentWeekDay = useWatch({
    control,
    name: `workoutDays.${dayIndex}.weekDay`,
  });

  const availableWeekDays = WEEKDAY_OPTIONS.filter(
    (opt) => !usedWeekDays.includes(opt.value) || opt.value === currentWeekDay,
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-navy-border bg-navy-surface/20 p-5">
      <div className="flex items-center justify-between">
        <span className="font-heading text-base font-semibold text-foreground">
          Dia {dayIndex + 1}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="size-9 text-destructive hover:text-destructive"
        >
          <Trash2 className="size-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name={`workoutDays.${dayIndex}.name`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-xs text-foreground/70">Nome do Dia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ex: Peito e Tríceps" className={INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`workoutDays.${dayIndex}.weekDay`}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-xs text-foreground/70">Dia da Semana</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 w-full rounded-xl border border-navy-border bg-navy-surface/50 text-sm text-foreground">
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableWeekDays.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`workoutDays.${dayIndex}.estimatedDurationMinutes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-foreground/70">Duração (min)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} className={INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`workoutDays.${dayIndex}.workoutTime`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs text-foreground/70">Horário</FormLabel>
              <FormControl>
                <Input {...field} type="time" className={INPUT_CLASS} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`workoutDays.${dayIndex}.isRest`}
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-xl border border-navy-border bg-navy-surface/30 px-4 py-3">
            <FormLabel className="cursor-pointer text-sm text-foreground">
              Dia de descanso
            </FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {!isRest && (
        <>
          <Separator className="bg-navy-border" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-semibold text-foreground">
                Exercícios
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    order: fields.length,
                    name: "",
                    sets: 3,
                    reps: 10,
                    restTimeInSeconds: 60,
                    obs: "",
                    exerciseLoad: "",
                  })
                }
                className="h-8 gap-1.5 rounded-lg border-navy-border bg-transparent text-xs text-foreground hover:bg-navy-surface"
              >
                <Plus className="size-3.5" />
                Adicionar Exercício
              </Button>
            </div>

            {fields.length === 0 && (
              <p className="text-center text-xs text-foreground/50">
                Nenhum exercício adicionado ainda
              </p>
            )}

            {fields.map((exercise, exerciseIndex) => (
              <ExerciseFormItem
                key={exercise.id}
                control={control}
                dayIndex={dayIndex}
                exerciseIndex={exerciseIndex}
                onRemove={() => remove(exerciseIndex)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
