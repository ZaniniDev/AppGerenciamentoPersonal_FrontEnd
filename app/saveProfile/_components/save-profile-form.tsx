"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera } from "lucide-react";
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { saveProfileAction } from "../_actions";

const formSchema = z.object({
  age: z.coerce.number().min(1).max(120),
  weightKg: z.coerce.number().min(1).max(500),
  heightCm: z.coerce.number().min(50).max(300),
  goal: z.string().optional(),
  trainingExperience: z.string().optional(),
  trainingType: z.string().optional(),
  weeklyFrequency: z.number().min(1).max(7),
});

type FormValues = z.infer<typeof formSchema>;

const EXPERIENCE_OPTIONS = [
  { value: "nunca_treinei", label: "Nunca treinei" },
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

const INPUT_CLASS =
  "h-14 rounded-xl border border-navy-border bg-navy-surface/50 text-base text-foreground placeholder:text-foreground/40";

export function SaveProfileForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      age: 25,
      weightKg: 75,
      heightCm: 180,
      goal: "",
      trainingExperience: "nunca_treinei",
      trainingType: "",
      weeklyFrequency: 3,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);
    setError(null);

    const result = await saveProfileAction({
      age: values.age,
      weightInGrams: Math.round(values.weightKg * 1000),
      heightInCentimeters: values.heightCm,
      bodyFatPercentage: 0,
      goal: values.goal,
      workoutTimeExperience: values.trainingExperience,
      workoutFrequency: values.weeklyFrequency,
      workoutType: values.trainingType,
    });

    setIsPending(false);

    if (result.status !== 200) {
      setError("Erro ao salvar perfil. Tente novamente.");
      return;
    }
    alert("Perfil salvo com sucesso!");
    router.push("/profile");
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
          Salvar Perfil
        </p>
        <div className="size-10" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col px-[25px] pb-28 pt-6"
        >
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Dados Pessoais
            </h2>
            <p className="text-sm leading-[1.4] text-foreground/60">
              Help us customize your workout plan based on your body and
              experience.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground/70">
                    Idade
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className={INPUT_CLASS} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weightKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground/70">
                    Peso (kg)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className={INPUT_CLASS} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="heightCm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground/70">
                    Altura (cm)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className={INPUT_CLASS} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <h3 className="font-heading text-xl font-semibold text-foreground">
              Seu Objetivo
            </h3>
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Escreva seu objetivo"
                      className="min-h-14 resize-none rounded-xl border border-navy-border bg-navy-surface/50 text-base text-foreground placeholder:text-foreground/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <FormField
              control={form.control}
              name="trainingExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground/70">
                    Experiência de Treino
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="h-14 w-full rounded-xl border border-navy-border bg-navy-surface/50 text-base text-foreground"
                      >
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPERIENCE_OPTIONS.map((opt) => (
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
              control={form.control}
              name="trainingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground/70">
                    Preferência de Tipo de Treino
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: Academia, Corrida, Futebol"
                      className={INPUT_CLASS}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <FormField
              control={form.control}
              name="weeklyFrequency"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm text-foreground/70">
                      Frequência Semanal
                    </FormLabel>
                    <span className="font-heading text-2xl font-bold text-foreground">
                      {field.value} Dias
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={1}
                      max={7}
                      step={1}
                      value={[field.value]}
                      onValueChange={([val]) => field.onChange(val)}
                      className="mt-3"
                    />
                  </FormControl>
                  <div className="mt-2 flex justify-between text-xs text-foreground/50">
                    <span>1 dia</span>
                    <span>4 dias</span>
                    <span>7 dias</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="relative mt-6 h-32 overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 to-primary/10">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary">
                <Camera className="size-5 text-primary-foreground" />
              </div>
              <span className="text-sm text-foreground/70">
                Adicionar Foto de Perfil
              </span>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}

          <div className="mt-6">
            <Button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground"
            >
              Salvar Perfil
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
