"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { lessonSchema, LessonSchema } from "@/lib/formValidationSchemas";
import { createLesson, updateLesson } from "@/lib/actions";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as const;

const LessonForm = ({
  type, data, setOpen, relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    { success: false, error: false },
  );

  const onSubmit = handleSubmit((formData) => formAction(formData));

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) toast.error(state.message ?? "Something went wrong!");
  }, [state, router, type, setOpen]);

  const subjects: { id: number; name: string }[]   = relatedData?.subjects ?? [];
  const classes:  { id: number; name: string }[]   = relatedData?.classes  ?? [];
  const teachers: { id: string; name: string; surname: string }[] = relatedData?.teachers ?? [];

  const fmtDatetime = (d?: Date | string) =>
    d ? new Date(d).toISOString().slice(0, 16) : "";

  return (
    <form className="flex flex-col gap-6 p-2" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new lesson" : "Update lesson"}
      </h1>

      {data?.id && <InputField label="Id" name="id" defaultValue={String(data.id)} register={register} error={errors.id} hidden />}

      <div className="flex flex-wrap gap-4">
        <InputField label="Lesson Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day <span className="text-red-400">*</span></label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("day")} defaultValue={data?.day ?? ""}>
            <option value="" disabled>Select day…</option>
            {DAYS.map((d) => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
          </select>
          {errors.day && <p className="text-xs text-red-400">{errors.day.message}</p>}
        </div>

        <InputField label="Start Time" name="startTime" type="datetime-local"
          defaultValue={fmtDatetime(data?.startTime)} register={register} error={errors.startTime} />
        <InputField label="End Time" name="endTime" type="datetime-local"
          defaultValue={fmtDatetime(data?.endTime)} register={register} error={errors.endTime} />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject <span className="text-red-400">*</span></label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("subjectId")} defaultValue={data?.subjectId ?? ""}>
            <option value="" disabled>Select subject…</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.subjectId && <p className="text-xs text-red-400">{errors.subjectId.message}</p>}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class <span className="text-red-400">*</span></label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("classId")} defaultValue={data?.classId ?? ""}>
            <option value="" disabled>Select class…</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.classId && <p className="text-xs text-red-400">{errors.classId.message}</p>}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher <span className="text-red-400">*</span></label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("teacherId")} defaultValue={data?.teacherId ?? ""}>
            <option value="" disabled>Select teacher…</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name} {t.surname}</option>)}
          </select>
          {errors.teacherId && <p className="text-xs text-red-400">{errors.teacherId.message}</p>}
        </div>
      </div>

      {state.error && <span className="text-red-500 text-sm">{state.message ?? "Something went wrong!"}</span>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors font-medium">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
