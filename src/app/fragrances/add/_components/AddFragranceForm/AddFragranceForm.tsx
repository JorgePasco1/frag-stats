"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export const AddFragranceForm = () => {
  const form = useForm<AddFragranceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      house: undefined,
      imageUrl: undefined,
    },
  });

  const router = useRouter();
  const { mutate: submitForm, isPending } =
    api.userFragrances.create.useMutation({
      onSuccess: () => {
        router.push("/fragrances/collection");
      },
    });
  const onSubmit = (values: AddFragranceFormValues) => {
    submitForm(values);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-w-96 flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="house"
          render={({ field }) => (
            <FormItem>
              <FormLabel>House</FormLabel>
              <FormControl>
                <Input placeholder="Chanel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="No. 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

const formSchema = z.object({
  name: z.string(),
  house: z.string(),
  imageUrl: z.string(),
});

type AddFragranceFormValues = z.infer<typeof formSchema>;
