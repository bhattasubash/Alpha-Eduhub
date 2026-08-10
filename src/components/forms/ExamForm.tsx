"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  examSchema,
  ExamSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createExam,
  createSubject,
  updateExam,
  updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { useState } from "react";

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    setLoading(true);
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      setLoading(false);
    }
  }, [state, router, type, setOpen]);

  const { lessons = [], classes = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-gray-800">
        {type === "create" ? "Create a new exam" : "Update the exam"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Section / Class Selection */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500 font-medium">Select Section / Class *</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full bg-white"
            {...register("classId")}
            defaultValue={data?.lesson?.classId || data?.classId || (classes[0]?.id ?? "")}
          >
            <option value="">-- Select Section / Class --</option>
            {classes.map((c: { id: number; name: string }) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>

        {/* Subject Name Text Input */}
        <InputField
          label="Subject Name (Text)"
          name="subjectName"
          placeholder="e.g. Mathematics, Science"
          defaultValue={data?.lesson?.subject?.name || data?.lessonName || ""}
          register={register}
          error={errors?.subjectName}
        />

        {/* Exam Title */}
        <InputField
          label="Exam Title"
          name="title"
          placeholder="e.g. Mid-Term Assessment"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        <InputField
          label="Start Date & Time"
          name="startTime"
          defaultValue={data?.startTime ? new Date(data.startTime).toISOString().slice(0, 16) : ""}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End Date & Time"
          name="endTime"
          defaultValue={data?.endTime ? new Date(data.endTime).toISOString().slice(0, 16) : ""}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        />

        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        <InputField
          label="Max Marks"
          name="maxMarks"
          type="number"
          defaultValue={data?.maxMarks ?? 100}
          register={register}
          error={errors?.maxMarks}
        />
        <InputField
          label="Passing Marks"
          name="passingMarks"
          type="number"
          defaultValue={data?.passingMarks ?? 40}
          register={register}
          error={errors?.passingMarks}
        />
        <InputField
          label="Instructions / Rules"
          name="instructions"
          placeholder="e.g. No calculators allowed"
          defaultValue={data?.instructions}
          register={register}
          error={errors?.instructions}
        />
      </div>

      {state.error && (
        <span className="text-red-500 text-sm">Something went wrong! Please check the fields.</span>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium p-2.5 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>{type === "create" ? "Creating Exam..." : "Updating Exam..."}</span>
          </>
        ) : (
          type === "create" ? "Create Exam" : "Update Exam"
        )}
      </button>
    </form>
  );
};

export default ExamForm;
