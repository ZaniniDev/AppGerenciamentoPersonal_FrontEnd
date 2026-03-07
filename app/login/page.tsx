"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import  Image  from "next/image";
import { authClient } from "@/app/_lib/auth-client";


// 1. Definição do Schema de Validação com Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  rememberMe: z.boolean(),
});

export default function LoginPage() {
  // 2. Inicialização do Formulário
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 3. Função de Submissão
  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      callbackURL: "/",
    });

    if (error) {
      alert("Email ou senha incorretos!");
      return;
    }
  }

  
   return (
       <div className="relative flex min-h-svh flex-col bg-black">
         <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
           <Image
             src="/login-bg.png"
             alt=""
             fill
             className="object-cover"
             priority
           />
         </div>
   
         <div className="relative z-10 flex justify-center pt-12">
           <Image src="/fit-ai-logo.svg" alt="FIT.AI" width={85} height={38} />
         </div>
   
         <div className="flex-1" />
   
         <div className="relative z-10 flex flex-col items-center gap-15 rounded-t-[20px] bg-primary px-5 pb-10 pt-12">
           <div className="flex w-full flex-col items-center gap-6">
             <h1 className="w-full text-center font-heading text-[32px] font-semibold leading-[1.05] text-primary-foreground">
               O app que vai transformar a forma como você treina.
             </h1>
             <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-1">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Lembrar-me neste dispositivo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </Form>
           </div>
   
           <p className="font-heading text-xs leading-[1.4] text-primary-foreground/70">
             ©2026 Copyright ZanSystems. Todos os direitos reservados
           </p>
         </div>
       </div>
     );
}