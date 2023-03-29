import { useState } from "react";
import { Form } from "../forms/form";

export function useForm<T>(name?: string) {
    const [form] = useState(new Form<T>(name));
    return form;
}