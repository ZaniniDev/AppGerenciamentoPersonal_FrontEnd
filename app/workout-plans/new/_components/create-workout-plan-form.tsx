"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WorkoutDayFormItem } from "./workout-day-form-item";
import { createWorkoutPlanAction } from "../_actions";

const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const exerciseSchema = z.object({
  order: z.coerce.number().min(0),
  name: z.string().min(1, "Nome é obrigatório"),
  sets: z.coerce.number().min(1, "Mínimo 1 série"),
  reps: z.coerce.number().min(1, "Mínimo 1 repetição"),
  restTimeInSeconds: z.coerce.number().min(1, "Mínimo 1 segundo"),
  obs: z.string().optional(),
  exerciseLoad: z.string().optional(),
});

const workoutDaySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  weekDay: z.enum(WEEK_DAYS),
  isRest: z.boolean().default(false),
  estimatedDurationMinutes: z.coerce.number().min(1, "Mínimo 1 minuto"),
  workoutTime: z.string().optional(),
  exercises: z.array(exerciseSchema),
});

const formSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    planGoal: z.string().min(1, "Objetivo é obrigatório"),
    workoutStartDate: z.string().optional(),
    workoutFinishDate: z.string().optional(),
    workoutDays: z.array(workoutDaySchema).min(1, "Adicione pelo menos 1 dia de treino"),
  })
  .refine(
    (data) => {
      const weekDays = data.workoutDays.map((d) => d.weekDay);
      return new Set(weekDays).size === weekDays.length;
    },
    {
      message: "Cada dia da semana pode ser usado apenas uma vez",
      path: ["workoutDays"],
    },
  );

export type WorkoutPlanFormValues = z.infer<typeof formSchema>;

const INPUT_CLASS =
  "h-14 rounded-xl border border-navy-border bg-navy-surface/50 text-base text-foreground placeholder:text-foreground/40";

interface CreateWorkoutPlanFormProps {
  hasActivePlan: boolean;
}

export function CreateWorkoutPlanForm({ hasActivePlan }: CreateWorkoutPlanFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<WorkoutPlanFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<WorkoutPlanFormValues>({
    resolver: zodResolver(formSchema) as Resolver<WorkoutPlanFormValues>,
    defaultValues: {
      name: "",
      planGoal: "",
      workoutStartDate: "",
      workoutFinishDate: "",
      workoutDays: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workoutDays",
  });

  const watchedDays = useWatch({ control: form.control, name: "workoutDays" });
  const usedWeekDays = (watchedDays ?? []).map((d) => d?.weekDay).filter(Boolean) as string[];

  async function submitPlan(values: WorkoutPlanFormValues) {
    setIsPending(true);
    setError(null);

    const result = await createWorkoutPlanAction({
      name: values.name,
      planGoal: values.planGoal,
      workoutStartDate: values.workoutStartDate
        ? dayjs(values.workoutStartDate).toISOString()
        : undefined,
      workoutFinishDate: values.workoutFinishDate
        ? dayjs(values.workoutFinishDate).toISOString()
        : undefined,
      workoutDays: values.workoutDays.map((day, index) => ({
        name: day.name,
        weekDay: day.weekDay,
        isRest: day.isRest,
        estimatedDurationInSeconds: day.estimatedDurationMinutes * 60,
        coverImageUrl: "",
        workoutTime: day.workoutTime || undefined,
        exercises: day.isRest
          ? []
          : day.exercises.map((ex, exIndex) => ({
              order: exIndex,
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              restTimeInSeconds: ex.restTimeInSeconds,
              obs: ex.obs || undefined,
              exerciseLoad: ex.exerciseLoad || undefined,
              exerciseId: "",
            })),
      })),
    });

    setIsPending(false);

    if (result.status !== 201) {
      setError("Erro ao criar plano de treino. Tente novamente.");
      return;
    }

    router.push(`/workout-plans/${result.data.id}`);
  }

  function onSubmit(values: WorkoutPlanFormValues) {
    if (hasActivePlan) {
      setPendingValues(values);
      setShowConfirmDialog(true);
      return;
    }
    submitPlan(values);
  }

  function handleConfirmSubmit() {
    if (pendingValues) {
      setShowConfirmDialog(false);
      submitPlan(pendingValues);
    }
  }

  return (
    <div className="dark flex min-h-svh flex-col bg-navy">
      <div className="sticky top-0 z-10 flex h-[65px] items-center border-b border-navy-surface bg-navy px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center"
        >
          <ChevronLeft className="size-6 text-primary" />
        </button>
        <p className="flex-1 text-center font-heading text-base font-semibold text-foreground">
          Novo Plano de Treino
        </p>
        <div className="size-10" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col px-6 pb-28 pt-6"
        >
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Plano de Treino
            </h2>
            <p className="text-sm leading-[1.4] text-foreground/60">
              Configure seu plano de treino personalizado.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground/70">
                    Nome do Plano
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: Hipertrofia 12 semanas"
                      className={INPUT_CLASS}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground/70">
                    Objetivo do Plano
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva o objetivo do seu plano de treino"
                      className="min-h-[80px] resize-none rounded-xl border border-navy-border bg-navy-surface/50 text-base text-foreground placeholder:text-foreground/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workoutStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-foreground/70">
                      Data de Início
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className={INPUT_CLASS} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workoutFinishDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-foreground/70">
                      Data de Término
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className={INPUT_CLASS} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Dias de Treino
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={fields.length >= 7}
                onClick={() =>
                  append({
                    name: "",
                    weekDay: "MONDAY",
                    isRest: false,
                    estimatedDurationMinutes: 60,
                    workoutTime: "",
                    exercises: [],
                  })
                }
                className="h-9 gap-1.5 rounded-xl border-navy-border bg-transparent text-sm text-foreground hover:bg-navy-surface"
              >
                <Plus className="size-4" />
                Adicionar Dia
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-navy-border py-10">
                <p className="text-sm text-foreground/50">
                  Nenhum dia adicionado ainda
                </p>
              </div>
            )}

            {fields.map((day, dayIndex) => (
              <WorkoutDayFormItem
                key={day.id}
                control={form.control}
                dayIndex={dayIndex}
                onRemove={() => remove(dayIndex)}
                usedWeekDays={usedWeekDays.filter(
                  (_, i) => i !== dayIndex,
                )}
              />
            ))}

            {form.formState.errors.workoutDays?.root?.message && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workoutDays.root.message}
              </p>
            )}
            {typeof form.formState.errors.workoutDays?.message === "string" && (
              <p className="text-sm text-destructive">
                {form.formState.errors.workoutDays.message}
              </p>
            )}
          </div>

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}

          <div className="mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-xl text-base font-semibold"
            >
              {isPending ? "Salvando..." : "Salvar Plano"}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-navy border-navy-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Desativar plano atual?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/60">
              Você já possui um plano de treino ativo. Ao criar um novo plano,
              o plano atual será desativado. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-navy-border bg-transparent text-foreground hover:bg-navy-surface">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit} disabled={isPending}>
              {isPending ? "Salvando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
