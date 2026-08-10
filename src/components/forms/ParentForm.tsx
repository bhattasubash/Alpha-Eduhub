"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import InputField from "../InputField";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { createParent, updateParent } from "@/lib/actions";

const ParentForm = ({
  type, data, setOpen,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [img, setImg] = useState<any>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
    { success: false, error: false },
  );

  const onSubmit = handleSubmit((formData) => {
    formAction({ ...formData, img: img?.secure_url });
  });

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) toast.error(state.message ?? "Something went wrong!");
  }, [state, router, type, setOpen]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return (
    <form className="flex flex-col gap-6 p-2" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new parent" : "Update parent"}
      </h1>

      {data?.id && <InputField label="Id" name="id" defaultValue={data.id} register={register} error={errors.id} hidden />}

      <span className="text-xs text-gray-400 font-medium">Authentication</span>
      <div className="flex flex-wrap gap-4">
        <InputField label="Username" name="username" defaultValue={data?.username} register={register} error={errors.username} />
        <InputField label="Email" name="email" defaultValue={data?.email} register={register} error={errors.email} />
        <InputField label="Password" name="password" type="password" register={register} error={errors.password} />
      </div>

      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <div className="flex flex-wrap gap-4">
        <InputField label="First Name" name="name" defaultValue={data?.name} register={register} error={errors.name} />
        <InputField label="Last Name" name="surname" defaultValue={data?.surname} register={register} error={errors.surname} />
        <InputField label="Phone" name="phone" defaultValue={data?.phone} register={register} error={errors.phone} />
        <InputField label="Address" name="address" defaultValue={data?.address} register={register} error={errors.address} />
      </div>

      {cloudName && cloudName !== "your_cloud_name_here" ? (
        <CldUploadWidget uploadPreset="school" onSuccess={(result, { widget }) => { setImg(result.info); widget.close(); }}>
          {({ open }) => (
            <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" onClick={() => open()}>
              <Image src="/upload.png" alt="" width={28} height={28} />
              <span>{img ? "Photo selected ✓" : "Upload a photo (optional)"}</span>
            </div>
          )}
        </CldUploadWidget>
      ) : null}

      {state.error && <span className="text-red-500 text-sm">{state.message ?? "Something went wrong!"}</span>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors font-medium">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ParentForm;
