import React from "react";
import { Form } from "../forms/form";

export const useForm = <T>(name?: string) => {
    const [form] = React.useState(new Form<T>(name));
    return form;
};